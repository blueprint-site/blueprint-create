import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { BlogType } from "@/types";
import { useLoggedUser } from "@/api/context/loggedUser/loggedUserContext.tsx";
import ImageUploader from "@/components/utility/ImageUploader.tsx";
import MarkdownEditor from "@/components/utility/MarkdownEditor.tsx";
import TagSelector from "@/components/utility/blog/TagSelector.tsx";
import { useToast } from "@/api";
import { useFetchBlog, useSaveBlog } from "@/api";

const AdminBlogEditor = () => {
    const { id } = useParams<{ id: string }>();
    const isNew = id === "new";
    const { toast } = useToast();
    const LoggedUser = useLoggedUser();
    const { data: blog, isLoading } = useFetchBlog(id);
    const saveBlogMutation = useSaveBlog();
    const [blogState, setBlogState] = useState<Partial<BlogType> | null>(null);

    useEffect(() => {
        if (!LoggedUser) return;

        if (id && !isNew && blog) {
            setBlogState(blog);
        } else {
            setBlogState({
                title: "",
                content: "",
                slug: "",
                img_url: "",
                status: "draft",
                tags: [],
                likes: 0,
                authors_uuid: [LoggedUser.user?.$id || ''],
                authors: [LoggedUser.user?.name || ''],
                created_at: new Date().toISOString(),
            });
        }
    }, [blog, isNew, LoggedUser]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBlogState((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSave = async () => {
        if (!blogState || !blogState.title || !blogState.content) {
            toast({
                className: "bg-surface-3 border-ring text-foreground",
                title: "⚠️ Missing Fields ⚠️",
                description: "Title and content are required!",
            });
            return;
        }
        saveBlogMutation.mutate(blogState, {
            onSuccess: async (response) => {
                    console.log(response)
                    toast({
                        className: "bg-surface-3 border-ring text-foreground",
                        title: "✅ Success ✅",
                        description: `${blogState.title} has been saved successfully!`,
                    });
                },
            onError: async (error) => {
                console.log(error);
                toast({
                    className: "bg-surface-3 border-ring text-foreground",
                    title: "❌ Error ❌",
                    description: `Failed to save ${blogState.title}. Please try again!`,
                });
            }
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="text-center mt-4">
                <h1>Blog Article Editor</h1>
            </div>
            <Card className="mx-auto p-4 w-full py-4">
                <CardContent className="w-full">
                    <div className="flex flex-row py-4 gap-4">
                        <div className="w-1/3">
                            <ImageUploader
                                value={blogState?.img_url}
                                onChange={(base64) =>
                                    setBlogState((prev) => (prev ? { ...prev, img_url: base64 ?? undefined } : null))
                                }
                            />
                        </div>
                        <div className="w-full justify-end">
                            <h3>Title</h3>
                            <Input name="title" value={blogState?.title || ""} onChange={handleChange} placeholder="Title" className="mb-2 w-full" />
                            <h3>Slug</h3>
                            <Input name="slug" value={blogState?.slug || ""} onChange={handleChange} placeholder="Slug" className="mb-2 w-full" />
                            <h3>Tags</h3>
                            <TagSelector
                                value={blogState?.tags || []}
                                onChange={(value) =>
                                    setBlogState((prev) => (prev ? { ...prev, tags: value ?? undefined } : null))
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <h3>Content</h3>
                        <MarkdownEditor
                            value={blogState?.content || ""}
                            onChange={(value) =>
                                setBlogState((prev) => (prev ? { ...prev, content: value ?? undefined } : null))
                            }
                        />
                    </div>
                    <Button className="float-end py-4" onClick={handleSave} disabled={saveBlogMutation.isPending}>
                        {saveBlogMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </CardContent>
            </Card>
        </>
    );
};

export default AdminBlogEditor;
