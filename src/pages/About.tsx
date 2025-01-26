import { lazy } from "react";

const AboutPageContent = lazy(() => import("@/components/About/AboutPageContent"));
const Contributors = lazy(() => import("@/components/About/Contributors"));

function About() {
  return (
    <>
      <AboutPageContent />
      <Contributors />
    </>
  );
}

export default About;
