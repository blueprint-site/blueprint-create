// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import BlogPage from "@/pages/blog/Blog";
import BlogDetails from "@/pages/blog/BlogDetails";

export const blogRoutes: RouteObject[] = [
    { path: 'blog', element: <BlogPage/>},
    { path: 'blog:id',element: <BlogDetails/>}
];