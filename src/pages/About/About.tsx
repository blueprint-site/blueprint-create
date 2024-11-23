import { Suspense, lazy } from "react";

import LoadingOverlay from "../../components/LoadingOverlays/LoadingOverlay";
const AboutPageContent = lazy(() => import("../../components/AboutPageContent"));
const Contributors = lazy(() => import("../../components/Contributors"));
function About() {
    return (
        <>
            <Suspense fallback={<LoadingOverlay />}>
                <AboutPageContent />
                <Contributors />
            </Suspense>
        </>
    );
}

export default About;