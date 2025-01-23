// src/pages/Home/Home.tsx

import LoadingOverlay from "@/components/LoadingOverlays/LoadingOverlay";
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import "./Home.module.scss";

const AddonsSlideshow = lazy(() => import("@/components/Home/AddonsSlideshow"));
const WhatIsBlueprint = lazy(() => import("@/components/Home/WhatIsBlueprint"));
const UsefulLinks = lazy(() => import("@/components/Home/UsefulLinks"));
const ForCreators = lazy(() => import("@/components/Home/ForCreators"));

function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingOverlay />}>
        {/* Hero Section */}
        <section className="connected-texture deep-shadow">
          <div className="container mx-auto py-12">
              <div className="text-4xl font-minecraft font-bold text-surface-text text-center pb-4">
                {t("home.discover")}
              </div>
              <AddonsSlideshow />
          </div>
        </section>

        {/* What is Blueprint Section */}
        <section className="py-12 bg-card">
          <WhatIsBlueprint />
        </section>

        {/* Two Column Section */}
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
