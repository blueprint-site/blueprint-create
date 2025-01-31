

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
import {Users, useUsers} from "@/context/users/usersContext.tsx";
import {AdminUsersDataTable} from "@/components/tables/users/Admin-users-data-table.tsx";


const AdminUsersTable =  () => {
    const users = useUsers()
    const columns: ColumnDef<Users>[] = [
        {
            id: "actions",
            cell: () => {

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions 🚀</DropdownMenuLabel>
                            <DropdownMenuItem>
                                Valid & check this addon ✅
                            </DropdownMenuItem>
                            <DropdownMenuItem

                            >
                                Invalid & Check this addon ❌
                            </DropdownMenuItem
                          >
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
        {
            accessorKey: "icon",
            header: "Icon",
            cell: ({ row }) => {
                return (
                    <Avatar>
                        <AvatarImage src={row.original.icon_url || ""} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                )


            }
        },
        {
            accessorKey: "display_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Display Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        },
        {
            accessorKey: "roles",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Roles
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            }
        },
    ]


    return (
        <div className="px-4 md:px-8">
            <AdminUsersDataTable columns={columns} data={users ||  [] }></AdminUsersDataTable>
        </div>
    );
}

export default AdminUsersTable