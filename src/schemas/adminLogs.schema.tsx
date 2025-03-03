import { z } from "zod";

export const AdminLogsSchema = z.object({
    $id: z.string(),
    type: z.string(),
    content: z.string(),
    category: z.string(),
    user_uuid: z.string(),
    $createdAt: z.string(),
    $updatedAt: z.string(),
})