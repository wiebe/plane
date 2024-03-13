enum EPageAccess {
  PUBLIC = 0,
  PRIVATE = 1,
}

export type TPageAccess = EPageAccess.PRIVATE | EPageAccess.PUBLIC;

export type TPage = {
  id: string | undefined;
  name: string | undefined;
  description_html: string | undefined;
  color: string | undefined;
  labels: string[] | undefined;
  owned_by: string | undefined;
  access: TPageAccess | undefined;
  is_favorite: boolean;
  is_locked: boolean;
  archived_at: string | undefined;
  workspace: string | undefined;
  project: string | undefined;
  created_by: string | undefined;
  updated_by: string | undefined;
  created_at: Date | undefined;
  updated_at: Date | undefined;
};

// page filters
export type TPageNavigationTabs = "public" | "private" | "archived";

export type TPageFiltersSortKey = "name" | "created_at" | "updated_at";

export type TPageFiltersSortBy = "asc" | "desc";

export type TPageFilters = {
  searchQuery: string;
  sortKey: TPageFiltersSortKey;
  sortBy: TPageFiltersSortBy;
};
