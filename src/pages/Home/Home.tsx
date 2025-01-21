// /src/pages/Home/Home.tsx
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import LoadingOverlay from "@/components/LoadingOverlays/LoadingOverlay";

const AddonsSlideshow = lazy(() => import("@/components/AddonsSlideshow"));
const WhatIsBlueprint = lazy(() => import("@/components/WhatIsBlueprint"));
const UsefulLinks = lazy(() => import("@/components/UsefulLinks"));
const HomeForCreators = lazy(() => import("@/components/HomeForCreators"));

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Suspense fallback={<LoadingOverlay />}>
        <h2 className="text-3xl font-semibold text-center my-3">
          {t('home.discover')}
        </h2>
        <AddonsSlideshow />

        <WhatIsBlueprint />
        <div className="flex flex-col md:flex-row">
          <HomeForCreators />
          <UsefulLinks />
        </div>
      </Suspense>
    </>
  );
}

export default Home;
