import z from 'zod';

export const OAuthProvidersSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});
