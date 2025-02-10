

import {AdminBlogTable} from "@/components/tables/blog/AdminBlogTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import { format } from "date-fns";
import {useEntityManager} from "@/hooks/useData.ts";
import {Blog, blogSchema} from "@/schemas/blog.schema.tsx";

const AdminBlogList = () => {
    const { data: blogs, isLoading, error, update, delete: deleteMutation } = useEntityManager<Blog>("blog_articles", blogSchema);

    const handleUpdateStatus = async (id: string, newStatus: "draft" | "published") => {
        try {
            await update.mutateAsync({ id, data: { status: newStatus } });
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id); // Utiliser deleteMutation ici
            console.log("Article deleted successfully!");
        } catch (error) {
            console.error("Failed to delete article:", error);
            alert("Failed to delete article. Please try again.");
        }
    };
    const columns: ColumnDef<Blog>[] = [
        {
            accessorKey: "img_url",
            header: "Image",
            cell: ({ row }) => {
                return (
                    <Avatar>
                        <AvatarImage src={row.original.img_url || ""} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                )


            }
        },
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        },
        {
            accessorKey: "authors",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Authors
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created at
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ getValue }) => {
                const createdAt = getValue() as string;
                // Formatage de la date
                const formattedDate = format(new Date(createdAt), "dd/MM/yyyy HH:mm");
                return <span>{formattedDate}</span>;
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                )
            },
            cell: ({ row }) => {
                   switch (row.original.status) {
                       case "draft":
                           return (
                             <div className={"text-center"}> Draft 📋 </div>
                           )
                       case "published":
                           return (
                               <div className={"text-center"}> Public ✅ </div>
                           )
                   }
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 bg-surface-1">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions 🚀</DropdownMenuLabel>
                            {row.original.status === "draft" ? (
                                <DropdownMenuItem
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleUpdateStatus(row.original.id.toString(), "published");
                                    }}
                                >
                                    Publish this article ✅
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleUpdateStatus(row.original.id.toString(), "draft");
                                    }}
                                >
                                    Unpublish this article 📋
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={async (event) => {
                                    event.stopPropagation();
                                    handleDelete(row.original.id.toString())
                                }}
                            >
                                Delete this article ❌
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }
    ]

    if (isLoading) return <p>Loading blogs...</p>;
    if (error) return <p>Error loading blogs: {error.message}</p>;
    // return the table
    return <div><AdminBlogTable columns={columns} data={blogs || []}/></div>
}
export default AdminBlogList