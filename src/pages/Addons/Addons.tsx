import LoadingOverlay from "@/components/LoadingOverlays/LoadingOverlay";
import Updater from "@/components/Updater";
import { Suspense, lazy, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AddonList = lazy(() => import("@/components/AddonList"));
const CollectionComponent = lazy(() => import("@/components/Collections"));

export default function Addons() {
  const location = useLocation(); // To detect location change

  Updater();

  useEffect(() => {
    // Restore the scroll position when the component mounts
    const savedScrollPosition = localStorage.getItem("addonsScrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    const saveScrollPosition = () => {
      // Save the current scroll position when the user navigates away
      console.log("Saving scroll position");
      localStorage.setItem("addonsScrollPosition", window.scrollY.toString());
    };

    // Save scroll position on location change
    saveScrollPosition();

    // Add event listener to save scroll position on beforeunload
    window.addEventListener("beforeunload", saveScrollPosition);

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener("beforeunload", saveScrollPosition);
    };
  }, [location]);

  return (
    <>
      <Suspense fallback={<LoadingOverlay />}>
        <CollectionComponent />
        <AddonList />
      </Suspense>
    </>
  );
}