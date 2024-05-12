import { Suspense, lazy } from "react";

import LoadingOverlay from "../../components/LoadingOverlay";

const AddonList = lazy(() => import("../../components/AddonList"));

export default function Addons() {
    return (
        <>
            <Suspense fallback={<LoadingOverlay />}>
                <AddonList />
            </Suspense>
        </>
    )
}