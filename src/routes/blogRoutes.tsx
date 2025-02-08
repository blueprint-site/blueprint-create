// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import BlogPage from "@/pages/Blog";
import BlogDetails from "@/components/features/blog/BlogDetails";

export const blogRoutes: RouteObject[] = [
    { path: 'blog', element: <BlogPage/>},
    { path: 'blog:id',element: <BlogDetails/>}
];