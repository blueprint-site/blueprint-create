import { Suspense, lazy } from "react";

import LoadingOverlay from "../../components/LoadingOverlays/LoadingOverlay";

const AddonsSlideshow = lazy(() => import("../../components/AddonsSlideshow"));
const AwardsBanner = lazy(() => import("../../components/AwardsBanner"));
const DiscoverAddonsText = lazy(() => import("../../components/DiscoverAddonsText"));
const WhatIsBlueprint = lazy(() => import("../../components/WhatIsBlueprint"));
const UsefulLinks = lazy(() => import("../../components/UsefulLinks"));
const HomeExploreSchematics = lazy(() => import("../../components/HomeExploreSchematics"));
const HomeRandomAddon = lazy(() => import("../../components/HomeRandomAddon"));
const HomeForCreators = lazy(() => import("../../components/HomeForCreators"));

function Home() {
  return (
    <>
      <Suspense fallback={<LoadingOverlay />}>
        <AwardsBanner />
        <DiscoverAddonsText />
        <AddonsSlideshow />
        <HomeRandomAddon />
        <HomeForCreators />
        <WhatIsBlueprint />
        <UsefulLinks />
      </Suspense>
    </>
  );
}

export default Home;
