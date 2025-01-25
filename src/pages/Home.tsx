// src/pages/Home/Home.tsx

import { Skeleton } from "@/components/ui/skeleton"; // Assuming Shadcn Skeleton component is available
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
      <Suspense fallback={<HomeSkeleton />}>
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

// Skeleton component for the loading state
function HomeSkeleton() {
  return (
    <div className="flex flex-col space-y-12">
      {/* Skeleton for the Discover section */}
      <section className="bg-andesite-casing deep-shadow py-12">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-1/2 mx-auto bg-gray-300" />
          <div className="my-5">
            <Skeleton className="h-64 w-full bg-gray-300" />
          </div>
        </div>
      </section>

      {/* Skeleton for the WhatIsBlueprint section */}
      <section className="py-12 bg-blueprint">
        <div className="container mx-auto">
          <Skeleton className="h-96 w-full bg-gray-300" />
        </div>
      </section>

      {/* Skeleton for the ForCreators and UsefulLinks section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full bg-gray-300" />
            <Skeleton className="h-96 w-full bg-gray-300" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;