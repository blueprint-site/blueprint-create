import {BlogDetailsHeader} from "@/components/features/blog/blog-details/BlogDetailsHeader.tsx";
import {BlogDetailsContent} from "@/components/features/blog/blog-details/BlogDetailsContent.tsx";
import {BlogDetailsFooter} from "@/components/features/blog/blog-details/BlogDetailsFooter.tsx";
import {Blog} from "@/types";

export interface BlogDetailsMainProps {
  blog: Blog;
}

export const BlogDetailsMain = ({blog}: BlogDetailsMainProps) => {
  console.log(blog);
  return (
    <div>
      <h1>{blog.title}</h1>
      <BlogDetailsHeader/>
      <BlogDetailsContent/>
      <BlogDetailsFooter/>
    </div>
  );
};
