import { useContext } from "react";
import merge from "lodash/merge";
// mobx store
import { StoreContext } from "contexts/store-context";
// types
import { IWorkspaceIssues, IWorkspaceIssuesFilter } from "store_legacy/issue/workspace";
import { IProfileIssues, IProfileIssuesFilter } from "store_legacy/issue/profile";
import { IProjectIssues, IProjectIssuesFilter } from "store_legacy/issue/project";
import { ICycleIssues, ICycleIssuesFilter } from "store_legacy/issue/cycle";
import { IModuleIssues, IModuleIssuesFilter } from "store_legacy/issue/module";
import { IProjectViewIssues, IProjectViewIssuesFilter } from "store_legacy/issue/project-views";
import { IArchivedIssues, IArchivedIssuesFilter } from "store_legacy/issue/archived";
import { IDraftIssues, IDraftIssuesFilter } from "store_legacy/issue/draft";
import { TIssueMap } from "@plane/types";
// constants
import { EIssuesStoreType } from "constants/issue";

type defaultIssueStore = {
  issueMap: TIssueMap;
};

export type TStoreIssues = {
  [EIssuesStoreType.GLOBAL]: defaultIssueStore & {
    issues: IWorkspaceIssues;
    issuesFilter: IWorkspaceIssuesFilter;
  };
  [EIssuesStoreType.PROFILE]: defaultIssueStore & {
    issues: IProfileIssues;
    issuesFilter: IProfileIssuesFilter;
  };
  [EIssuesStoreType.PROJECT]: defaultIssueStore & {
    issues: IProjectIssues;
    issuesFilter: IProjectIssuesFilter;
  };
  [EIssuesStoreType.CYCLE]: defaultIssueStore & {
    issues: ICycleIssues;
    issuesFilter: ICycleIssuesFilter;
  };
  [EIssuesStoreType.MODULE]: defaultIssueStore & {
    issues: IModuleIssues;
    issuesFilter: IModuleIssuesFilter;
  };
  [EIssuesStoreType.PROJECT_VIEW]: defaultIssueStore & {
    issues: IProjectViewIssues;
    issuesFilter: IProjectViewIssuesFilter;
  };
  [EIssuesStoreType.ARCHIVED]: defaultIssueStore & {
    issues: IArchivedIssues;
    issuesFilter: IArchivedIssuesFilter;
  };
  [EIssuesStoreType.DRAFT]: defaultIssueStore & {
    issues: IDraftIssues;
    issuesFilter: IDraftIssuesFilter;
  };
  [EIssuesStoreType.DEFAULT]: defaultIssueStore & {
    issues: undefined;
    issuesFilter: undefined;
  };
};

export const useIssues = <T extends EIssuesStoreType>(storeType?: T): TStoreIssues[T] => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useIssues must be used within StoreProvider");

  const defaultStore: defaultIssueStore = {
    issueMap: context.issue.issues.issuesMap,
  };

  switch (storeType) {
    case EIssuesStoreType.GLOBAL:
      return merge(defaultStore, {
        issues: context.issue.workspaceIssues,
        issuesFilter: context.issue.workspaceIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.PROFILE:
      return merge(defaultStore, {
        issues: context.issue.profileIssues,
        issuesFilter: context.issue.profileIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.PROJECT:
      return merge(defaultStore, {
        issues: context.issue.projectIssues,
        issuesFilter: context.issue.projectIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.CYCLE:
      return merge(defaultStore, {
        issues: context.issue.cycleIssues,
        issuesFilter: context.issue.cycleIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.MODULE:
      return merge(defaultStore, {
        issues: context.issue.moduleIssues,
        issuesFilter: context.issue.moduleIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.PROJECT_VIEW:
      return merge(defaultStore, {
        issues: context.issue.projectViewIssues,
        issuesFilter: context.issue.projectViewIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.ARCHIVED:
      return merge(defaultStore, {
        issues: context.issue.archivedIssues,
        issuesFilter: context.issue.archivedIssuesFilter,
      }) as TStoreIssues[T];
    case EIssuesStoreType.DRAFT:
      return merge(defaultStore, {
        issues: context.issue.draftIssues,
        issuesFilter: context.issue.draftIssuesFilter,
      }) as TStoreIssues[T];
    default:
      return merge(defaultStore, {
        issues: undefined,
        issuesFilter: undefined,
      }) as TStoreIssues[T];
  }
};
