import { Suspense, lazy } from "react";

import LoadingOverlay from "../../components/LoadingOverlay";

const AddonsSlideshow = lazy(() => import("../../components/AddonsSlideshow"));
const AwardsBanner = lazy(() => import("../../components/AwardsBanner"));
const DiscoverAddonsText = lazy(() => import("../../components/DiscoverAddonsText"));
const WhatIsBlueprint = lazy(() => import("../../components/WhatIsBlueprint"));
const UsefulLinks = lazy(() => import("../../components/UsefulLinks"));
const Contributors = lazy(() => import("../../components/Contributors"));

function Home() {
  return (
    <>
      <Suspense fallback={<LoadingOverlay />}>
        <AwardsBanner />
        <DiscoverAddonsText />
        <AddonsSlideshow />
        <WhatIsBlueprint />
        <UsefulLinks />
        <Contributors />
      </Suspense>
    </>
  );
}

export default Home;
