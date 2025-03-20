// CurseForge Project Types
export interface CurseForgeRawObject {
  screenshots: CurseForgeScreenshot[];
  id: number;
  gameId: number;
  name: string;
  slug: string;
  links: CurseForgeLinks;
  summary: string;
  status: number;
  downloadCount: number;
  isFeatured: boolean;
  primaryCategoryId: number;
  categories: CurseForgeCategory[];
  classId: number;
  authors: CurseForgeAuthor[];
  logo: CurseForgeLogo;
  mainFileId: number;
  latestFiles: CurseForgeFile[];
  latestFilesIndexes: CurseForgeFileIndex[];
  latestEarlyAccessFilesIndexes: CurseForgeFileIndex[];
  dateCreated: string;
  dateModified: string;
  dateReleased: string;
  allowModDistribution: boolean;
  gamePopularityRank: number;
  isAvailable: boolean;
  thumbsUpCount: number;
  serverAffiliation: CurseForgeServerAffiliation;
  socialLinks: CurseForgeSocialLink[];
  featuredProjectTag: number;
}

export interface CurseForgeScreenshot {
  id: number;
  modId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

export interface CurseForgeLinks {
  websiteUrl: string;
  wikiUrl: string;
  issuesUrl: string;
  sourceUrl: string;
}

export interface CurseForgeCategory {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  url: string;
  iconUrl: string;
  dateModified: string;
  isClass: boolean;
  classId: number;
  parentCategoryId: number;
}

export interface CurseForgeAuthor {
  id: number;
  name: string;
  url: string;
  avatarUrl: string;
}

export interface CurseForgeLogo {
  id: number;
  modId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

export interface CurseForgeFile {
  id: number;
  gameId: number;
  modId: number;
  isAvailable: boolean;
  displayName: string;
  fileName: string;
  releaseType: number;
  fileStatus: number;
  hashes: CurseForgeHash[];
  fileDate: string;
  fileLength: number;
  downloadCount: number;
  fileSizeOnDisk?: number;
  downloadUrl: string;
  gameVersions: string[];
  sortableGameVersions: CurseForgeSortableGameVersion[];
  dependencies: CurseForgeFileDependency[];
  alternateFileId: number;
  isServerPack: boolean;
  fileFingerprint: number;
  modules: CurseForgeFileModule[];
}

export interface CurseForgeHash {
  value: string;
  algo: number; // 1 = SHA1, 2 = MD5
}

export interface CurseForgeSortableGameVersion {
  gameVersionName: string;
  gameVersionPadded: string;
  gameVersion: string;
  gameVersionReleaseDate: string;
  gameVersionTypeId: number;
}

export interface CurseForgeFileDependency {
  modId: number;
  relationType: number; // 1 = required, 2 = optional, 3 = includes, etc.
}

export interface CurseForgeFileModule {
  name: string;
  fingerprint: number;
}

export interface CurseForgeFileIndex {
  gameVersion: string;
  fileId: number;
  filename: string;
  releaseType: number;
  gameVersionTypeId: number;
  modLoader: number; // 1 = Forge, 4 = Fabric, 5 = Quilt, 6 = NeoForge
}

export interface CurseForgeSocialLink {
  type: number; // 2 = Discord, 13 = GitHub, etc.
  url: string;
}

export interface CurseForgeServerAffiliation {
  isEnabled: boolean;
  isDefaultBanner: boolean;
  hasDiscount: boolean;
  affiliationService: number;
  customImageUrl: string;
  affiliationLink: string;
}
