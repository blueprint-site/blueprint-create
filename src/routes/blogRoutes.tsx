// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router';
import BlogDetails from '@/pages/blog/BlogDetails';

export const blogRoutes: RouteObject[] = [{ path: 'blog/:slug', element: <BlogDetails /> }];
