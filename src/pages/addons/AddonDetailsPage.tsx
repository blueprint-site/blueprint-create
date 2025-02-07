// src/pages/addons/AddonDetailPage.tsx
import { useParams } from "react-router-dom";
import AddonDetails from "@/components/Addons/AddonDetails";

export default function AddonDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <div>Invalid addon</div>;
  }

  return <AddonDetails />;
}