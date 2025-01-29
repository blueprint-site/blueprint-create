// GitHub Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export interface ContributorStats {
  login: string;
  id: number;
  avatar_url: string;
  frontendContributions: number;
  apiContributions: number;
}

// Auth Types
export interface UserData {
  id: string;
  email?: string;
  created_at: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    custom_claims?: {
      global_name?: string;
    };
    preferred_username?: string;
  };
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
}

export interface Addon {
  id: number, // id of the addon
  name: string, // Name of the addon
  description: string, // Description of the addon
  slug: string, // Slug used for navigation in the url
  author: string, // Authors of the mod
  categories: string[], // Categories of the addon exemple : ["Addons","Ores and Resources","Utility & QoL","Technology"]
  downloads: number, // Number of downloads from modrinth
  icon: string, // Base64 encoded
  datecreated: Date, // Date of the creation of the record
  datemodified: Date, // Last time it have been updated
  curseforge_raw?: curseForgeAddon, // contain the raw data from the modrinth Api  => see modrinthAddon
  modrinth_raw?: modrinthAddon, // contain the raw data from the curseforge Api  => see curseforgeAddon
  sources: string[], // Array with "Modrinth" or CurseForge
  isValid: boolean, // Utils to return the final list with only valid addon
  isChecked: boolean, // Utils to be sur the addon have been verified by an admin and can sort them by not checked
  versions: string[]
}

export interface modrinthAddon {
  project_id: string // Unique identifier for the project on Modrinth
  project_type: string // Type of the project (e.g., mod, plugin)
  slug: string // URL-friendly identifier for the project
  author: string // Name of the project author
  title: string // Title of the project
  description: string // Short description of the project
  categories: string[] // List of categories the project belongs to
  display_categories: string[] // List of displayable categories for UI purposes
  versions: string[] // Array of supported versions for the project
  downloads: number // Total number of downloads for the project
  follows: number // Number of followers for the project
  icon_url: string // URL of the project's icon image
  date_created: string // Date the project was created
  date_modified: string // Date the project was last updated
  latest_version: string // Identifier for the latest version of the project
  license: string // License under which the project is published
  client_side: string // Specifies client-side compatibility (e.g., "required", "optional", "unsupported")
  server_side: string // Specifies server-side compatibility (e.g., "required", "optional", "unsupported")
  gallery: string[] // Array of gallery image URLs for the project
  featured_gallery?: string // Optional featured image from the gallery
  color: number // Color code associated with the project for display
}

export interface curseForgeAddon {
  screenshots: Screenshot[] // Array of screenshots associated with the addon
  id: number // Unique identifier for the addon on CurseForge
  gameId: number // Game ID associated with the addon
  name: string // Name of the addon
  slug: string // URL-friendly identifier for the addon
  links: Links // Object containing external links related to the addon
  summary: string // Short summary of the addon
  status: number // Status of the addon (e.g., published, archived)
  downloadCount: number // Total number of downloads for the addon
  isFeatured: boolean // Indicates if the addon is featured on CurseForge
  primaryCategoryId: number // ID of the addon's primary category
  categories: Category[] // List of categories the addon belongs to
  classId: number // Class ID for the addon
  authors: Author[] // List of authors who contributed to the addon
  logo: Logo // Logo information for the addon
  mainFileId: number // ID of the main file for the addon
  latestFiles: LatestFile[] // List of the latest files for the addon
  latestFilesIndexes: LatestFilesIndex[] // List of indexed files by game version
  latestEarlyAccessFilesIndexes: string[] // List of files available for early access
  dateCreated: string // Date the addon was created
  dateModified: string // Date the addon was last updated
  dateReleased: string // Date the addon was released
  allowModDistribution: boolean // Indicates if mod distribution is allowed
  gamePopularityRank: number // Popularity rank of the addon within the game
  isAvailable: boolean // Indicates if the addon is currently available
  thumbsUpCount: number // Number of thumbs-up ratings for the addon
  socialLinks?: SocialLink[] // Optional array of social links related to the addon
  serverAffiliation?: ServerAffiliation // Optional server affiliation details
}

export interface Screenshot {
  id: number // Unique identifier for the screenshot
  modId: number // ID of the mod the screenshot belongs to
  title: string // Title of the screenshot
  description: string // Description of the screenshot
  thumbnailUrl: string // URL for the thumbnail of the screenshot
  url: string // Full URL of the screenshot
}

export interface Links {
  websiteUrl: string // URL of the addon's website
  wikiUrl?: string // Optional URL of the addon's wiki
  issuesUrl: string // URL for reporting issues (can be null)
  sourceUrl: string // URL to the source code (can be null)
}

export interface Category {
  id: number // Unique identifier for the category
  gameId: number // Game ID the category is associated with
  name: string // Name of the category
  slug: string // URL-friendly identifier for the category
  url: string // Full URL of the category
  iconUrl: string // URL for the icon of the category
  dateModified: string // Date the category was last updated
  isClass: boolean // Indicates if the category is a class
  classId: number // Class ID associated with the category
  parentCategoryId: number // ID of the parent category
}

export interface Author {
  id: number // Unique identifier for the author
  name: string // Name of the author
  url: string // URL to the author's profile or website
  avatarUrl?: string // Optional URL of the author's avatar
}

export interface Logo {
  id: number // Unique identifier for the logo
  modId: number // ID of the mod the logo belongs to
  title: string // Title of the logo
  description: string // Description of the logo
  thumbnailUrl: string // URL for the thumbnail of the logo
  url: string // Full URL of the logo
}

export interface LatestFile {
  id: number // Unique identifier for the file
  gameId: number // Game ID associated with the file
  modId: number // Mod ID the file belongs to
  isAvailable: boolean // Indicates if the file is currently available
  displayName: string // Display name of the file
  fileName: string // File name
  releaseType: number // Type of release (e.g., alpha, beta, release)
  fileStatus: number // Status of the file
  hashes: Hash[] // List of hash values for the file
  fileDate: string // Date the file was created
  fileLength: number // Size of the file in bytes
  downloadCount: number // Total number of downloads for the file
  downloadUrl?: string // Optional URL for downloading the file
  gameVersions: string[] // Array of game versions the file is compatible with
  sortableGameVersions: SortableGameVersion[] // Array of sortable game version objects
  dependencies: Dependency[] // List of dependencies required for the file
  alternateFileId: number // ID of the alternate file
  isServerPack: boolean // Indicates if the file is a server pack
  fileFingerprint: number // Fingerprint of the file for validation
  modules: Module[] // List of modules included in the file
  fileSizeOnDisk?: number // Optional size of the file on disk
  serverPackFileId?: number // Optional server pack file ID
}


export interface Hash {
  value: string // The hash value (checksum) of the file
  algo: number // The algorithm used to compute the hash (e.g., SHA1, MD5, etc.)
}

export interface SortableGameVersion {
  gameVersionName: string // The name of the game version (e.g., "1.19.4")
  gameVersionPadded: string // The padded version string for sorting purposes
  gameVersion: string // The actual game version
  gameVersionReleaseDate: string // The release date of the game version
  gameVersionTypeId: number // The type ID of the game version
}

export interface Dependency {
  modId: number // The ID of the dependency mod
  relationType: number // The type of dependency relation (e.g., required, optional, etc.)
}

export interface Module {
  name: string // The name of the module
  fingerprint: number // The unique fingerprint value of the module for validation
}

export interface LatestFilesIndex {
  gameVersion: string // The game version associated with the file
  fileId: number // The unique ID of the file
  filename: string // The name of the file
  releaseType: number // The release type (e.g., alpha, beta, release)
  gameVersionTypeId: number // The type ID of the game version
  modLoader?: number // The ID of the mod loader (optional)
}

export interface SocialLink {
  type: number // The type of social link (e.g., Discord, Twitter)
  url: string // The URL of the social link
}

export interface ServerAffiliation {
  isEnabled: boolean // Indicates if the server affiliation is enabled
  isDefaultBanner: boolean // Indicates if the default banner is being used
  hasDiscount: boolean // Indicates if there is a discount for the affiliation
  affiliationService: number // The ID of the affiliation service
  defaultBannerCustomTitle: string // Custom title for the default banner
  affiliationLink: string // URL link to the affiliation page
}
