import * as z from 'zod';
import axios from 'axios';
export const ModrinthMod = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  client_side: z.enum(['required', 'optional', 'unsupported', 'unknown']),
  server_side: z.enum(['required', 'optional', 'unsupported', 'unknown']),
  body: z.string(),
  status: z.enum([
    'approved',
    'archived',
    'rejected',
    'draft',
    'unlisted',
    'processing',
    'withheld',
    'scheduled',
    'private',
    'unknown',
  ]),
  requested_status: z.enum(['approved', 'archived', 'unlisted', 'private', 'draft']).nullable(),
  additional_categories: z.array(z.string()),
  issues_url: z.string().nullable(),
  source_url: z.string().nullable(),
  wiki_url: z.string().nullable(),
  discord_url: z.string().nullable(),
  donation_urls: z.array(z.string()),
  project_type: z.enum(['mod', 'modpack', 'resourcepack','shader']),
  color: z.int().nullable(),
  updated: z.iso.datetime(),
  published: z.iso.datetime(),
  followers: z.int(),
  gallery: z.array(z.string()),
  loaders: z.array(z.string()),
});

export const ModrinthModDependecies = z.object({
  projects: z.array(z.string()),
  versions: z.array(z.string()),
});

function fetchModrinthMod(slug: string) {
    
}

export function fetchModrinthModDependencies(slug: string) {
    const response = axios.get(`https://api.modrinth.com/v2/project/${slug}/dependencies`)
    .then(
        (response) => {
            return ModrinthModDependecies.parse(response.data);
        }
    )
}