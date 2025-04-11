export interface Author {
  id: number;
  name: string;
  url: string;
  avatarUrl?: string | null;
  claimed_by?: string | null;
}

export interface License {
  id: string;
  name: string;
  url: string;
}

export interface Category {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  url: string;
  iconUrl: string;
  dateModified: string;
  isClass: boolean;
  classId: number;
  parentCategoryId: number;
}
