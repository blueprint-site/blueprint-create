import * as z from "zod";

export const addon = z.object({
    $id: z.string(),
    name: z.string().max(150).nonempty(),
    description: z.string().max(5000),
    slug: z.string().max(120),
    icon: z.string().max(500),
    created_at: z.date(),
    updated_at: z.date(),
    isValid: z.boolean(),
    isChecked: z.boolean(),
    curseforge_raw: z.string().optional(),
    modrinth_raw: z.string().optional(),
    sources: z.array(z.string()).nonempty().max(20),
    modrinth_id: z.string().max(50).optional(),
    curseforge_id: z.string().max(50).optional(),
    claimed_by: z.string().max(256).optional(),
    downloads: z.number().prefault(0),
    loaders: z.array(z.string()).nonempty().max(64),
    create_versions: z.array(z.string()).nonempty().max(32).optional(),
    minecraft_versions: z.array(z.string()).nonempty().max(32),
    authors: z.array(z.string()).nonempty().max(100),
    categories: z.array(z.string()).nonempty().max(120).optional(),
    stage: z.enum(["pending", "reviewing", "approved", "rejected", "archived"]).optional(),
    reviewedAt: z.date().optional(),
    lastValidated: z.date().optional(),
    reviewedBy: z.string().max(255).optional()
})

export const featuredAddon = z.object({
    $id: z.string(),
    slug: z.string().max(100),
    addon_id: z.string(),
    title: z.string().max(150).nonempty(),
    description: z.string().max(500),
    image_url: z.url(),
    banner_url: z.url(),
    display_order: z.number().min(0).max(20),
    active: z.boolean(),
    category: z.array(z.string()).max(100).optional().prefault([])
})