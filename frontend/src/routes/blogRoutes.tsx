// src/routes/authRoutes.tsx
import type { RouteObject } from 'react-router';
import BlogDetails from '@/pages/blog/BlogDetails';

export const blogRoutes: RouteObject[] = [{ path: 'blog/:id/:slug', element: <BlogDetails /> }];
