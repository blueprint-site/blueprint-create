import { useUsers } from "@/context/users/usersContext";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CheckCircle} from "lucide-react";
import {LoadingSpinner} from "@/components/LoadingOverlays/LoadingSpinner.tsx";


export const UsersStatsDisplayRegistered = () => {
    const users = useUsers();

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Users Registered</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{users ? users.length : <LoadingSpinner/>}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Number of users registered</p>
            </CardContent>
        </Card>
    );
};

