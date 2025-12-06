import { Addon } from "@/types/addons";
import { z } from "zod";
import AddonCard from "./AddonCard";

type AddonType = z.infer<typeof Addon>;

export default function AddonGrid({ data }: { data: AddonType[] }) {
    return (
        <div className="">
            <div className="">
                <span>search placeholder</span>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((addon) => (
                    <AddonCard key={addon.$id} addon={addon} />
                ))}
            </div>
        </div>
    )
}