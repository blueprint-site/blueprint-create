import { useFetchAddon, useFetchAddons } from "@/utils/useAddons"
import AddonCard from "./AddonCard";
import AddonGrid from "./AddonGrid";
export default function AddonsPage() {
    const data = useFetchAddons(1, 5);
    return (
        <div className="">
            <AddonGrid data={data.data || []} />
        </div>
    )
}