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
    <div className="flex flex-col gap-12">
      <Suspense fallback={<LoadingOverlay />}>
        {/* Hero Section */}
        <section className="py-6 bg-background">
          <h2 className="text-3xl font-semibold text-center">
            {t('home.discover')}
          </h2>
          <AddonsSlideshow />
        </section>

        {/* What is Blueprint Section */}
        <section className="py-12 bg-background">
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