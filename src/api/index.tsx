// MeiliSearch API endpoints
export { useSearchAddons } from './endpoints/useSearchAddons';
export { useSearchSchematics } from './endpoints/useSearchSchematics';

// Appwrite API endpoints
export {
  useDeleteBlog,
  useFetchBlog,
  useFetchBlogs,
  useFetchBlogBySlug,
  useFetchBlogTags,
  useSaveBlog,
} from './endpoints/useBlogs';

export {
  useDeleteAddon,
  useFetchAddon,
  useFetchAddonBySlug,
  useFetchAddons,
  useUpdateAddon,
} from './endpoints/useAddons';

// Modrinth API endpoints
export {
  useFetchModrinthProject,
  useFetchModrinthVersions,
  useFetchModrinthDependencies,
  useModrinthProfile,
  useModrinthProjects,
} from './endpoints/useModrinth';

export {
  useBlogTags,
  useCreateBlogTag,
  useDeleteBlogTag,
  useUpdateBlogTag,
} from './endpoints/useBlogTags';

export {
  useSchematicTags,
  useCreateSchematicTag,
  useDeleteSchematicTag,
  useUpdateSchematicTag,
} from './endpoints/useSchematicTags';

// MOVE THESE TO HOOKS FOLDER
export { useToast, toast } from '@/hooks/useToast';
export { useSystemThemeSync } from './endpoints/useSystemThemeSync';
export {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useCurrentBreakpoint,
} from './endpoints/useBreakpoints';
