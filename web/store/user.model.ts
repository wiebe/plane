import { makeObservable, observable, runInAction } from "mobx";
import { WorkspaceService } from "services/workspace.service";
import set from "lodash/set";
import { IWorkspace } from "@plane/types";
import { DataStore } from "./dataMaps";
import { IWorkspaceModel } from "./workspace.model";

export interface IUserModel {
  workspaces: Record<string, IWorkspaceModel>;
}

export class UserModel implements IUserModel {
  workspaces: Record<string, IWorkspaceModel> = {};

  // data store
  dataStore;
  // services
  workspaceService;

  constructor(_dataStore: DataStore) {
    makeObservable(this, {
      workspaces: observable,
    });
    this.dataStore = _dataStore;
    this.workspaceService = new WorkspaceService();
  }

  /**
   * get workspace info from the array of workspaces in the store using workspace slug
   * @param workspaceSlug
   */
  getWorkspaceBySlug = (workspaceSlug: string) =>
    Object.values(this.workspaces ?? {})?.find((w) => w.slug == workspaceSlug) || null;

  /**
   * fetch user workspaces from API
   */
  fetchWorkspaces = async () => {
    const workspaceResponse = await this.workspaceService.userWorkspaces();

    this.dataStore.workspaceData.addWorkspaces(workspaceResponse);
    runInAction(() => {
      workspaceResponse.forEach((workspace) => {
        set(this.workspaces, [workspace.id], this.dataStore.workspaceData.workspaceMap[workspace.id]);
      });
    });
    return workspaceResponse;
  };

  /**
   * create workspace using the workspace data
   * @param data
   */
  createWorkspace = async (data: Partial<IWorkspace>) =>
    await this.workspaceService.createWorkspace(data).then((response) => {
      this.dataStore.workspaceData.addWorkspaces([response]);
      runInAction(() => {
        set(this.workspaces, [response.id], this.dataStore.workspaceData.workspaceMap[response.id]);
      });
      return response;
    });

  /**
   * delete workspace using the workspace slug
   * @param workspaceSlug
   */
  deleteWorkspace = async (workspaceSlug: string) =>
    await this.workspaceService.deleteWorkspace(workspaceSlug).then(() => {
      const updatedWorkspacesList = this.workspaces;
      const workspaceId = this.getWorkspaceBySlug(workspaceSlug)?.id;
      this.dataStore.workspaceData.deleteWorkspace(`${workspaceId}`);
      runInAction(() => {
        delete updatedWorkspacesList[`${workspaceId}`];
      });
    });
}
