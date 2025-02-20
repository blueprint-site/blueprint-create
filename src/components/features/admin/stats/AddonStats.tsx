import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";


export const AddonStatsDisplayScanned = () => {

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Addons Scanned</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">

                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Number of addons Scanned</div>
            </CardContent>
        </Card>
    );
};

export const AddonStatsDisplayValidated = () => {



    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Addons Valided</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">

                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Number of addon valided</div>
            </CardContent>
        </Card>
    );
};