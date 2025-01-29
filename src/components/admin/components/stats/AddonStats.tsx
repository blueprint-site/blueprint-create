import { useAddons } from "@/context/addons/addonsContext.tsx";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CheckCircle} from "lucide-react";
import {LoadingSpinner} from "@/components/LoadingOverlays/LoadingSpinner.tsx";


export const AddonStatsDisplayScanned = () => {
    const addons = useAddons();

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Addons Scanned</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{addons ? addons.length : <LoadingSpinner/>}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Number of addons Scanned</p>
            </CardContent>
        </Card>
    );
};

export const AddonStatsDisplayValidated = () => {
    const addons = useAddons();
    const [nbrOfAddonsValidated, setNbr] = useState(0);

    useEffect(() => {
        if (addons) {
            const count = addons.filter(addon => addon.isValid).length;
            setNbr(count);
        }
    }, [addons]);

    return (
        <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Addons Validated</CardTitle>
                <CheckCircle className="w-6 h-6 text-green-500" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{nbrOfAddonsValidated ? nbrOfAddonsValidated : <LoadingSpinner/>}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Number of addons in Validated</p>
            </CardContent>
        </Card>
    );
};