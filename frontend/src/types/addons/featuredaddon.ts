// Interface for featured addon, used in: admin Panel, /home slideshow
export interface FeaturedAddonSchema {
  addon_id: string;
  title: string;
  description: string;
  image_url: string;
  banner_url: string;
  display_order: number;
  slug: string;
  active: boolean;
  category: string[] | null;
}
