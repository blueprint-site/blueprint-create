import { lazy } from "react";

const AboutPageContent = lazy(() => import("@/components/About/AboutPageContent"));
const ContributorCard = lazy(() => import("@/components/About/ContributorCard"));
const About = () => {
  return (
    <>
      <AboutPageContent />
      <ContributorCard />
    </>
  );
}
export default About;