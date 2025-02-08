import AdminUsersTable from "@/components/features/admin/users/AdminUsersTable";
import {UsersProvider} from "@/context/users/usersContext";

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