// src/pages/Home/Home.tsx

import LoadingOverlay from "@/components/LoadingOverlays/LoadingOverlay";
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

const AddonsSlideshow = lazy(() => import("@/components/Home/AddonsSlideshow"));
const WhatIsBlueprint = lazy(() => import("@/components/Home/WhatIsBlueprint"));
const UsefulLinks = lazy(() => import("@/components/Home/UsefulLinks"));
const ForCreators = lazy(() => import("@/components/Home/ForCreators"));

function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingOverlay />}>
        <section className="bg-andesite-casing deep-shadow py-12">
          <div className="container mx-auto">
              <div className="text-4xl font-minecraft font-bold text-white/90 text-center drop-shadow-lg">
                {t("home.discover")}
              </div>
              <div className="my-5">
                <AddonsSlideshow />
              </div>
          </div>
        </section>

        <section className="py-12 bg-blueprint">
          <WhatIsBlueprint />
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <ForCreators />
              <UsefulLinks />
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  );
}

export default Home;
