import { useFetchAddon } from "@/utils/useAddons"

export default function AddonsPage() {
    const data = useFetchAddon("693069ca291c238ba4d7")
    return (
        <div className="">
            <span>addons page</span>
            {data.data?.categories}
        </div>
    )
}