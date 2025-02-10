import { z } from "zod";

export const usersSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    display_name: z.string(),
    email: z.string().email(),
    roles: z.array(z.string()),
    icon_url: z.string().nullable().optional(),
});

export type Users = z.infer<typeof usersSchema>;
