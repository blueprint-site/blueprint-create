import type { Addon } from '@/types';
import type { AddonWithParsedFields } from '@/types/addons/addon-details';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  validate: (addon: AddonWithParsedFields) => ValidationResult;
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  message: string;
  details?: string[];
}

export interface AddonValidationScore {
  totalScore: number;
  maxScore: number;
  percentage: number;
  confidence: 'high' | 'medium' | 'low';
  results: Record<string, ValidationResult>;
  autoApprovalReady: boolean;
  flags: string[];
  suggestions: string[];
}

export const CREATE_MOD_KEYWORDS = [
  'create',
  'create mod',
  'create addon',
  'create:',
  'trains',
  'contraption',
  'mechanical',
  'kinetic',
  'rotation',
  'stress',
  'brass',
  'andesite',
  'cogwheel',
  'shaft',
  'gearbox',
  'belt',
  'crusher',
  'press',
  'mixer',
  'basin',
  'depot',
  'schematic',
  'ponder',
  'windmill',
  'waterwheel',
  'steam',
  'flywheel',
  'encased',
  'funnel',
  'chute',
  'creative motor',
  'display link',
  'redstone link',
  'mechanical arm',
  'deployer',
  'mechanical crafter',
  'sequenced gearshift',
  'rotation speed controller',
  'mechanical bearing',
  'clockwork bearing',
  'rope pulley',
  'mechanical piston',
  'crushing wheel',
  'millstone',
  'mechanical saw',
  'contraption controls',
  'portable storage interface',
  'mechanical pump',
  'fluid pipe',
  'smart fluid pipe',
  'fluid tank',
  'spout',
  'item drain',
  'mechanical harvester',
  'mechanical plough',
  'cart assembler',
  'linear chassis',
  'radial chassis',
  'super glue',
  'sticker',
  'gantry',
  'track',
  'train',
  'bogey',
  'station',
  'signal',
  'conductor',
  'schedule',
  'blaze burner',
  'steam engine',
  'whistle',
  'elevator pulley',
  'contraption controller',
];

export const ADDON_CATEGORIES = [
  'create-addon',
  'create',
  'technology',
  'automation',
  'trains',
  'decoration',
  'storage',
  'utility',
];

class AddonValidator {
  private rules: ValidationRule[] = [
    {
      id: 'create_dependency',
      name: 'Create Mod Dependency',
      description: 'Checks if addon has Create mod as a dependency',
      weight: 30,
      validate: (addon) => this.validateCreateDependency(addon),
    },
    {
      id: 'keyword_presence',
      name: 'Create Keywords',
      description: 'Checks for Create-related keywords in name and description',
      weight: 20,
      validate: (addon) => this.validateKeywordPresence(addon),
    },
    {
      id: 'version_compatibility',
      name: 'Version Compatibility',
      description: 'Validates Minecraft and Create version compatibility',
      weight: 15,
      validate: (addon) => this.validateVersionCompatibility(addon),
    },
    {
      id: 'metadata_completeness',
      name: 'Metadata Completeness',
      description: 'Checks if all required metadata is present',
      weight: 15,
      validate: (addon) => this.validateMetadataCompleteness(addon),
    },
    {
      id: 'source_verification',
      name: 'Source Verification',
      description: 'Validates addon sources (CurseForge/Modrinth)',
      weight: 10,
      validate: (addon) => this.validateSources(addon),
    },
    {
      id: 'category_relevance',
      name: 'Category Relevance',
      description: 'Checks if addon has relevant categories',
      weight: 10,
      validate: (addon) => this.validateCategories(addon),
    },
  ];

  validateAddon(addon: AddonWithParsedFields): AddonValidationScore {
    const results: Record<string, ValidationResult> = {};
    let totalScore = 0;
    const maxScore = 100;
    const flags: string[] = [];
    const suggestions: string[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(addon);
      results[rule.id] = result;
      totalScore += result.score;

      if (!result.passed && result.details) {
        flags.push(...result.details);
      }
    }

    const percentage = Math.round((totalScore / maxScore) * 100);

    let confidence: 'high' | 'medium' | 'low';
    if (percentage >= 85) {
      confidence = 'high';
    } else if (percentage >= 60) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    const autoApprovalReady = percentage >= 85 && results.create_dependency.passed;

    if (!results.create_dependency.passed) {
      suggestions.push('Consider verifying Create mod dependency manually');
    }
    if (!results.keyword_presence.passed) {
      suggestions.push('Review addon description for Create mod relevance');
    }
    if (!results.metadata_completeness.passed) {
      suggestions.push('Request missing metadata from author');
    }

    return {
      totalScore,
      maxScore,
      percentage,
      confidence,
      results,
      autoApprovalReady,
      flags,
      suggestions,
    };
  }

  private validateCreateDependency(addon: AddonWithParsedFields): ValidationResult {
    const modrinthDeps = addon.modrinth_raw_parsed?.dependencies || [];
    const curseforgeDeps = addon.curseforge_raw_parsed?.relations?.dependencies || [];

    const hasCreateDep =
      modrinthDeps.some(
        (dep) =>
          dep.project_id?.toLowerCase().includes('create') || dep.slug?.toLowerCase() === 'create'
      ) ||
      curseforgeDeps.some((dep) => dep.slug?.toLowerCase() === 'create' || dep.modId === 328085);

    if (hasCreateDep) {
      return {
        passed: true,
        score: 30,
        message: 'Create mod dependency found',
      };
    }

    const nameHasCreate = addon.name?.toLowerCase().includes('create');
    if (nameHasCreate) {
      return {
        passed: true,
        score: 20,
        message: 'Name suggests Create addon, but no explicit dependency found',
        details: ['Manual verification recommended'],
      };
    }

    return {
      passed: false,
      score: 0,
      message: 'No Create mod dependency detected',
      details: ['Missing Create mod dependency'],
    };
  }

  private validateKeywordPresence(addon: AddonWithParsedFields): ValidationResult {
    const text = `${addon.name || ''} ${addon.description || ''}`.toLowerCase();
    const foundKeywords = CREATE_MOD_KEYWORDS.filter((keyword) =>
      text.includes(keyword.toLowerCase())
    );

    const keywordCount = foundKeywords.length;
    const score = Math.min(20, keywordCount * 4);

    if (keywordCount >= 5) {
      return {
        passed: true,
        score: 20,
        message: `Found ${keywordCount} Create-related keywords`,
        details: foundKeywords.slice(0, 5),
      };
    } else if (keywordCount > 0) {
      return {
        passed: true,
        score,
        message: `Found ${keywordCount} Create-related keywords`,
        details: foundKeywords,
      };
    }

    return {
      passed: false,
      score: 0,
      message: 'No Create-related keywords found',
      details: ['Missing Create mod keywords in name/description'],
    };
  }

  private validateVersionCompatibility(addon: AddonWithParsedFields): ValidationResult {
    const hasMinecraftVersions = addon.minecraft_versions?.length > 0;
    const hasCreateVersions = addon.create_versions?.length > 0;
    const hasLoaders = addon.loaders?.length > 0;

    let score = 0;
    const issues: string[] = [];

    if (hasMinecraftVersions) {
      score += 5;
    } else {
      issues.push('Missing Minecraft versions');
    }

    if (hasCreateVersions) {
      score += 7;
    } else {
      issues.push('Missing Create mod versions');
    }

    if (hasLoaders) {
      score += 3;
    } else {
      issues.push('Missing mod loader information');
    }

    const commonVersions = ['1.18.2', '1.19.2', '1.20.1'];
    const hasCommonVersion = addon.minecraft_versions?.some((v) => commonVersions.includes(v));

    if (hasCommonVersion && score > 0) {
      score = 15;
    }

    return {
      passed: score >= 10,
      score,
      message: score >= 10 ? 'Version compatibility verified' : 'Version information incomplete',
      details: issues.length > 0 ? issues : undefined,
    };
  }

  private validateMetadataCompleteness(addon: AddonWithParsedFields): ValidationResult {
    let score = 0;
    const missingFields: string[] = [];

    if (addon.name && addon.name.length > 2) {
      score += 3;
    } else {
      missingFields.push('Name');
    }

    if (addon.description && addon.description.length > 50) {
      score += 3;
    } else {
      missingFields.push('Complete description');
    }

    if (addon.author && addon.author.length > 0) {
      score += 3;
    } else {
      missingFields.push('Author');
    }

    if (addon.icon && addon.icon.length > 0) {
      score += 3;
    } else {
      missingFields.push('Icon');
    }

    if (addon.categories && addon.categories.length > 0) {
      score += 3;
    } else {
      missingFields.push('Categories');
    }

    return {
      passed: score >= 12,
      score,
      message: score >= 12 ? 'Metadata is complete' : 'Missing required metadata',
      details: missingFields.length > 0 ? missingFields : undefined,
    };
  }

  private validateSources(addon: AddonWithParsedFields): ValidationResult {
    const hasCurseForge = !!addon.curseforge_raw_parsed;
    const hasModrinth = !!addon.modrinth_raw_parsed;
    const hasSources = addon.sources?.length > 0;

    let score = 0;
    const details: string[] = [];

    if (hasCurseForge) {
      score += 5;
      details.push('CurseForge verified');
    }

    if (hasModrinth) {
      score += 5;
      details.push('Modrinth verified');
    }

    if (!hasCurseForge && !hasModrinth && hasSources) {
      score = 3;
      details.push('Has source links but no platform data');
    }

    return {
      passed: score >= 5,
      score,
      message: score >= 5 ? 'Sources verified' : 'Source verification incomplete',
      details: details.length > 0 ? details : undefined,
    };
  }

  private validateCategories(addon: AddonWithParsedFields): ValidationResult {
    const categories = addon.categories || [];
    const relevantCategories = categories.filter((cat) =>
      ADDON_CATEGORIES.some((validCat) => cat.toLowerCase().includes(validCat))
    );

    const score = Math.min(10, relevantCategories.length * 5);

    return {
      passed: relevantCategories.length > 0,
      score,
      message:
        relevantCategories.length > 0
          ? `Found ${relevantCategories.length} relevant categories`
          : 'No Create-related categories',
      details:
        relevantCategories.length > 0 ? relevantCategories : ['No relevant categories found'],
    };
  }

  getValidationSummary(score: AddonValidationScore): {
    icon: '🟢' | '🟡' | '🔴';
    label: string;
    color: 'success' | 'warning' | 'destructive';
    recommendation: string;
  } {
    if (score.confidence === 'high') {
      return {
        icon: '🟢',
        label: 'Auto-Approval Ready',
        color: 'success',
        recommendation: 'This addon meets all criteria for automatic approval',
      };
    } else if (score.confidence === 'medium') {
      return {
        icon: '🟡',
        label: 'Quick Review Needed',
        color: 'warning',
        recommendation: 'Review flagged items before approval',
      };
    } else {
      return {
        icon: '🔴',
        label: 'Manual Review Required',
        color: 'destructive',
        recommendation: 'This addon requires thorough manual review',
      };
    }
  }
}

export const addonValidator = new AddonValidator();
