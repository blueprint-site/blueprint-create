import { Suspense, lazy } from "react";

import LoadingOverlay from "@/components/LoadingOverlays/LoadingOverlay";
const AboutPageContent = lazy(() => import("@/components/About/AboutPageContent"));
const Contributors = lazy(() => import("@/components/About/Contributors"));

function About() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <AboutPageContent />
      <Contributors />
    </Suspense>
  );
}

export default About;
