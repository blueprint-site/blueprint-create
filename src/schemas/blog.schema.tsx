import { z } from "zod";


export const blogSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    slug: z.string(),
    img_url: z.string(),
    status: z.string(),
    links: z.object({}).nullable(),
    tags: z.array(z.object({})).nullable().optional(),
    likes: z.number(),
    authors_uuid: z.array(z.string()),
    authors: z.array(z.string()),
    created_at: z.string(),
});

export type Blog = z.infer<typeof blogSchema>;
