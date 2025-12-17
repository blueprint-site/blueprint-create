import { useParams } from "react-router-dom"

export default function ExpandedAddonPage() {
    const slug = useParams().slug?.toString()
    return (
        <div className="">{slug}</div>
    )
}