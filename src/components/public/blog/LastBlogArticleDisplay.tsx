import { BlogType } from "@/types";
import { useEffect, useState } from "react";
import supabase from "@/components/utility/Supabase.tsx";
import {
    Card,
    CardContent,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import MarkdownDisplay from "@/components/utility/MarkdownDisplay.tsx";
import BlogTagsDisplay from "@/components/utility/blog/BlogTagsDisplay.tsx";
import {LoadingOverlay} from "@/components/loading-overlays/LoadingOverlay.tsx";



export interface LastBlogArticleDisplayProps {
    value?: BlogType[];
}

const LastBlogArticleDisplay = ({ value }: LastBlogArticleDisplayProps) => {
    const [blogs, setBlogs] = useState<BlogType[]>([]);

    useEffect(() => {
        const getBlogArticles = async () => {
            try {
                const { data, error } = await supabase
                    .from("blog_articles")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .eq("status", "published")
                    .range(0, 5);
                if (error) {
                    console.error("Error fetching blog articles:", error);
                }
                if (data) {
                    setBlogs(data);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        if (value) {
            setBlogs(value);
        } else {
            getBlogArticles().then();
        }
    }, [value]);

    return (
        <div className="flex flex-row flex-wrap gap-4 py-4 mx-4">
            {blogs.length > 0 ? blogs.map((blog: BlogType, index: number) => (
                <Card key={index} className="w-full md:w-1/4 bg-surface-1">
                    <CardHeader>
                        <img src={blog.img_url} alt={''} />
                        <CardTitle className={"text-foreground"}>
                            <h1> {blog.title} </h1>
                        </CardTitle>
                        <CardDescription>
                            <BlogTagsDisplay value={blog.tags}/>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MarkdownDisplay  content={blog.content} />
                    </CardContent>
                    <CardFooter className={"float-end"}>
                        <CardDescription className={"text-foreground-muted"}>
                            {blog.authors.map((author, index: number) => (
                                <div key={index}>{author}</div>
                            ))}
                        </CardDescription>
                    </CardFooter>
                </Card>
            )) : <LoadingOverlay />}
        </div>
    );
};

export default LastBlogArticleDisplay;
