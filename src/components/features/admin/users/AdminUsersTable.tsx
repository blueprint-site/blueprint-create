import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {AdminUsersDataTable} from "@/components/tables/users/Admin-users-data-table";
import {Button} from "@/components/ui/button.tsx";
import {useEntityManager} from "@/hooks/useData.ts";
import { usersSchema, Users} from "@/schemas/users.schema.tsx";


const AdminUsersTable = () => {

    const { data: profiles, isLoading, error } = useEntityManager<Users>("profiles", usersSchema);

    if (isLoading) {
        return <div>Loading profiles...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const columns: ColumnDef<Users>[] = [
        {
            accessorKey: "icon",
            header: "Icon",
            cell: ({ row }) => {
                return (
                    <Avatar>
                        <AvatarImage src={row.original.icon_url || undefined} alt={row.original.display_name} />
                        <AvatarFallback className={"font-bold"}>
                            {row.original.display_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                );
            },
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
                );
            },
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
                );
            },
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
                );
            },
        },
    ];

    return (
        <div className="px-4 md:px-8">
            <AdminUsersDataTable columns={columns} data={profiles || []} />
        </div>
    );
};


export default AdminUsersTable