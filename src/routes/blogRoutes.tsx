// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import BlogDetails from '@/pages/blog/BlogDetails';

export const blogRoutes: RouteObject[] = [
  { path: 'blog/:slug', element: <BlogDetails /> },
];
