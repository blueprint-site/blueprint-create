import { Suspense, lazy } from "react";

import LoadingOverlay from "../../components/LoadingOverlays/LoadingOverlay";
const Contributors = lazy(() => import("../../components/Contributors"));
const AboutPageTitle = lazy(() => import("../../components/AboutPageTitle"));

function About() {
    return (
        <>
            <Suspense fallback={<LoadingOverlay />}>
                <AboutPageTitle />
                <Contributors />
            </Suspense>
        </>
    );
}

export default About;