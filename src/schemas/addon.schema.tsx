import { z } from "zod";

export const ScreenshotSchema = z.object({
    id: z.number(),
    modId: z.number(),
    title: z.string(),
    description: z.string(),
    thumbnailUrl: z.string(),
    url: z.string()
});

export const LinksSchema = z.object({
    websiteUrl: z.string(),
    wikiUrl: z.string().optional().nullable(),
    issuesUrl: z.string().nullable(),
    sourceUrl: z.string().nullable()
});

export const CategorySchema = z.object({
    id: z.number(),
    gameId: z.number(),
    name: z.string(),
    slug: z.string(),
    url: z.string(),
    iconUrl: z.string(),
    dateModified: z.string(),
    isClass: z.boolean(),
    classId: z.number(),
    parentCategoryId: z.number()
});

export const AuthorSchema = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    avatarUrl: z.string().optional().nullable()
});

export const LogoSchema = z.object({
    id: z.number(),
    modId: z.number(),
    title: z.string(),
    description: z.string(),
    thumbnailUrl: z.string(),
    url: z.string()
});

export const HashSchema = z.object({
    value: z.string(),
    algo: z.number()
});

export const SortableGameVersionSchema = z.object({
    gameVersionName: z.string(),
    gameVersionPadded: z.string(),
    gameVersion: z.string(),
    gameVersionReleaseDate: z.string(),
    gameVersionTypeId: z.number()
});

export const DependencySchema = z.object({
    modId: z.number(),
    relationType: z.number()
});

export const ModuleSchema = z.object({
    name: z.string(),
    fingerprint: z.number()
});

export const LatestFilesIndexSchema = z.object({
    gameVersion: z.string(),
    fileId: z.number(),
    filename: z.string(),
    releaseType: z.number(),
    gameVersionTypeId: z.number(),
    modLoader: z.number().optional().nullable()
});

export const SocialLinkSchema = z.object({
    type: z.number(),
    url: z.string()
});

export const ServerAffiliationSchema = z.object({
    isEnabled: z.boolean(),
    isDefaultBanner: z.boolean(),
    hasDiscount: z.boolean(),
    affiliationService: z.number(),
    defaultBannerCustomTitle: z.string().optional().nullable(),
    affiliationLink: z.string()
});

export const LatestFileSchema = z.object({
    id: z.number(),
    gameId: z.number(),
    modId: z.number(),
    isAvailable: z.boolean(),
    displayName: z.string(),
    fileName: z.string(),
    releaseType: z.number(),
    fileStatus: z.number(),
    hashes: z.array(HashSchema),
    fileDate: z.string(),
    fileLength: z.number(),
    downloadCount: z.number(),
    downloadUrl: z.string().optional().nullable(),
    gameVersions: z.array(z.string()),
    sortableGameVersions: z.array(SortableGameVersionSchema),
    dependencies: z.array(DependencySchema),
    alternateFileId: z.number(),
    isServerPack: z.boolean(),
    fileFingerprint: z.number(),
    modules: z.array(ModuleSchema),
    fileSizeOnDisk: z.number().optional().nullable(),
    serverPackFileId: z.number().optional().nullable()
});

export const CurseForgeAddonSchema = z.object({
    screenshots: z.array(ScreenshotSchema),
    id: z.number(),
    gameId: z.number(),
    name: z.string(),
    slug: z.string(),
    links: LinksSchema,
    summary: z.string(),
    status: z.number(),
    downloadCount: z.number(),
    isFeatured: z.boolean(),
    primaryCategoryId: z.number(),
    categories: z.array(CategorySchema),
    classId: z.number(),
    authors: z.array(AuthorSchema),
    logo: LogoSchema,
    mainFileId: z.number(),
    latestFiles: z.array(LatestFileSchema),
    latestFilesIndexes: z.array(LatestFilesIndexSchema),
    latestEarlyAccessFilesIndexes: z.array(z.string()),
    dateCreated: z.string(),
    dateModified: z.string(),
    dateReleased: z.string(),
    allowModDistribution: z.boolean(),
    gamePopularityRank: z.number(),
    isAvailable: z.boolean(),
    thumbsUpCount: z.number(),
    socialLinks: z.array(SocialLinkSchema).optional().nullable(),
    serverAffiliation: ServerAffiliationSchema.optional().nullable()
});

export const ModrinthAddonSchema = z.object({
    project_id: z.string(),
    project_type: z.string(),
    slug: z.string(),
    author: z.string(),
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    display_categories: z.array(z.string()),
    versions: z.array(z.string()),
    downloads: z.number(),
    follows: z.number(),
    icon_url: z.string(),
    date_created: z.string(),
    date_modified: z.string(),
    latest_version: z.string(),
    license: z.string(),
    client_side: z.string(),
    server_side: z.string(),
    gallery: z.array(z.string()),
    featured_gallery: z.string().optional().nullable(),
    color: z.number().optional().nullable(),
});

export const AddonSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    author: z.string(),
    categories: z.array(z.string()),
    downloads: z.number(),
    icon: z.string(),
    created_at: z.string(),
    datemodified: z.string().optional().nullable(),
    curseforge_raw: CurseForgeAddonSchema.optional().nullable(),
    modrinth_raw: ModrinthAddonSchema.optional().nullable(),
    sources: z.array(z.string()),
    isValid: z.boolean(),
    isChecked: z.boolean(),
    versions: z.array(z.string()).optional().nullable(),
});


export type Addon = z.infer<typeof AddonSchema>;
