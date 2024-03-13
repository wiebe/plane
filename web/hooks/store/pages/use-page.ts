import { useContext } from "react";
import useSWR from "swr";
// context
import { StoreContext } from "contexts/store-context";
// hooks
import { useProjectPages } from "./use-project-page";
// mobx store
import { IPageStore } from "store/pages/page.store";

export const usePage = (projectId: string, pageId: string): IPageStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useProjectPublish must be used within StoreProvider");

  if (!projectId || !pageId) throw new Error("projectId, pageId must be passed as a property");

  const { fetchById } = useProjectPages(projectId);

  useSWR(projectId && pageId ? `PROJECT_PAGE_DETAIL_${projectId}_${pageId}` : null, async () => {
    projectId && pageId && (await fetchById(pageId));
  });

  return context.projectPage.data?.[projectId]?.[pageId] ?? {};
};
