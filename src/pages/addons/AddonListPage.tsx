// src/pages/addons/ListPage.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AddonList from "@/components/Addons/AddonList";
import CollectionSidebar from "@/components/Addons/Collections";

export default function ListPage() {
  const location = useLocation();

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
    <>
      <AddonList />
      <CollectionSidebar />
    </>
  );
}