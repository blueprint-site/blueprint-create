import LoadingOverlay from "@/components/LoadingOverlays/LoadingOverlay";
import Updater from "@/components/utility/Updater";
import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AddonList = lazy(() => import("@/components/Addons/AddonList"));
const CollectionSidebar = lazy(() => import("@/components/Addons/Collections"));

export default function Addons() {
  const location = useLocation();

  Updater();

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem("addonsScrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    const saveScrollPosition = () => {
      localStorage.setItem("addonsScrollPosition", window.scrollY.toString());
    };

    saveScrollPosition();
    window.addEventListener("beforeunload", saveScrollPosition);
    return () => window.removeEventListener("beforeunload", saveScrollPosition);
  }, [location]);

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <AddonList />
      <CollectionSidebar />
    </Suspense>
  );
}