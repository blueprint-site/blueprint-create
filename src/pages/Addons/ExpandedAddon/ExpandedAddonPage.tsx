import { useParams } from "react-router-dom"
import { useFetchAddonBySlug } from "@/utils/useAddons"
export default function ExpandedAddonPage() {
    const slug = useParams().slug?.toString()
    const addon = useFetchAddonBySlug(slug)?.data
    return (
        <div className="">
            {/* header */}
            <div className="">
               {addon && <img src={addon.icon} alt="" />} 
            </div>
        </div>
    )
}