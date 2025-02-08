import AdminUsersTable from "@/components/features/admin/users/AdminUsersTable.tsx";
import {UsersProvider} from "@/context/users/usersContext.tsx";

const AdminUsersDisplay = () => {
return (
    <div>
        <UsersProvider>
            <AdminUsersTable />
        </UsersProvider>

    </div>

);
}
export default AdminUsersDisplay