import { useFetchAddon, useFetchAddons } from "@/utils/useAddons"
import AddonCard from "./AddonCard";

export default function AddonsPage() {
    const data = useFetchAddons(1, 5);
    return (
        <div className="">
            <span>addons page</span>
            {data.data?.map((addon) => (
                <AddonCard key={addon.$id} addon={addon} />
            ))}
        </div>
    )
}