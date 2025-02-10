
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CheckCircle} from "lucide-react";
import {LoadingSpinner} from "@/components/loading-overlays/LoadingSpinner";
import {useEntityManager} from "@/hooks/useData.ts";
import {Users, usersSchema} from "@/schemas/users.schema.tsx";


export const UsersStatsDisplayRegistered = () => {
    const {data: profiles} = useEntityManager<Users>("profiles", usersSchema);

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Users Registered</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{profiles ? profiles.length : <LoadingSpinner/>}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Number of users registered</div>
            </CardContent>
        </Card>
    );
};

