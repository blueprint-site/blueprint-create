// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';
import BlogPage from "@/pages/Blog.tsx";
import BlogDetails from "@/components/public/blog/BlogDetails.tsx";

export const blogRoutes: RouteObject[] = [
    { path: 'blog', element: <BlogPage/>},
    { path: 'blog:id',element: <BlogDetails/>}
];