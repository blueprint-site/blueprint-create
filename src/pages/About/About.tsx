import { Suspense, lazy } from "react";

import LoadingOverlay from "../../components/LoadingOverlay";
import Contributors from "../../components/Contributors";
import AboutPageTitle from "../../components/AboutPageTitle";
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