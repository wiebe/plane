import { action, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { set } from "lodash";
// store
import { DataStore } from ".";
import { WorkspaceModel } from "store/workspace.store";
// types
import { IWorkspace } from "@plane/types";

export interface IWorkspaceData {
  // observables
  workspaceMap: Record<string, WorkspaceModel>;
  // actions
  addWorkspace: (workspaces: IWorkspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  getWorkspaceById: (workspaceId: string) => WorkspaceModel | undefined;
}

export class WorkspaceData implements IWorkspaceData {
  // observables
  workspaceMap: Record<string, WorkspaceModel> = {};
  // data store
  dataStore;

  constructor(_dataStore: DataStore) {
    makeObservable(this, {
      // observables
      workspaceMap: observable,
      // actions
      addWorkspace: action,
      deleteWorkspace: action,
    });
    this.dataStore = _dataStore;
  }

  /**
   * @description add a workspace to the workspace map
   * @param {IWorkspace} workspace
   */
  addWorkspace = (workspace: IWorkspace) =>
    set(this.workspaceMap, [workspace.id], new WorkspaceModel(workspace, this.dataStore));

  /**
   * @description delete a workspace from the workspace map
   * @param {string} workspaceId
   */
  deleteWorkspace = (workspaceId: string) => delete this.workspaceMap[workspaceId];

  /**
   * @description get a workspace model by its id
   * @param {string} workspaceId
   * @returns {WorkspaceModel | undefined} workspace model
   */
  getWorkspaceById = computedFn((workspaceId: string) => this.workspaceMap[workspaceId]);
}
