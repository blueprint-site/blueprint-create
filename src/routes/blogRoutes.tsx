// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import BlogPage from "@/pages/Blog.tsx";

export const blogRoutes: RouteObject[] = [
    { path: 'blog', element: <BlogPage/>},
];