import AdminUsersTable from "@/components/admin/components/users/AdminUsersTable.tsx";
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