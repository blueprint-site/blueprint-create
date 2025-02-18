import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-overlays/LoadingSpinner";
import supabase from "@/components/utility/Supabase.tsx";
import { useQuery } from "@tanstack/react-query";

export const AddonStatsDisplayScanned = () => {
    const { data: totalAddons, isLoading } = useQuery({
        queryKey: ["addons-count"],
        queryFn: async () => {
            const { count, error } = await supabase
                .from("mods")
                .select("*", { count: "exact", head: true });

            if (error) throw error;
            return count;
        },
    });

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Addons Scanned</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {isLoading ? <LoadingSpinner /> : totalAddons ?? 0}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Number of addons Scanned</div>
            </CardContent>
        </Card>
    );
};

export const AddonStatsDisplayValidated = () => {
    const { data: addons, isLoading } = useQuery({
        queryKey: ["validated-addons"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("mods")
                .select("*")
                .eq("isValid", true);

            if (error) throw error;
            return data;
        },
    });

    const totalValidAddons = addons?.length ?? 0;

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Addons Valided</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {isLoading ? <LoadingSpinner /> : totalValidAddons}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Number of addon valided</div>
            </CardContent>
        </Card>
    );
};