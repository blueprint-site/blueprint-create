// MeiliSearch API endpoints
export { useSearchAddons } from './meilisearch/useSearchAddons';
export { useSearchSchematics } from './meilisearch/useSearchSchematics';

// Appwrite API endpoints
export {
  useDeleteBlog,
  useFetchBlog,
  useFetchBlogs,
  useFetchBlogBySlug,
  useFetchBlogTags,
  useSaveBlog,
} from './appwrite/useBlogs';

export {
  useDeleteAddon,
  useFetchAddon,
  useFetchAddonBySlug,
  useFetchAddons,
  useUpdateAddon,
} from './appwrite/useAddons';

// Modrinth API endpoints
export {
  useFetchModrinthProject,
  useFetchModrinthVersions,
  useFetchModrinthDependencies,
  useModrinthProfile,
  useModrinthProjects,
} from './external/useModrinth';

export {
  useBlogTags,
  useCreateBlogTag,
  useDeleteBlogTag,
  useUpdateBlogTag,
} from './appwrite/useBlogTags';

export {
  useSchematicTags,
  useCreateSchematicTag,
  useDeleteSchematicTag,
  useUpdateSchematicTag,
} from './appwrite/useSchematicTags';

export { useGitHubContributors } from './external/useGithubContributors';
