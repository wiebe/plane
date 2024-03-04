import { makeObservable, observable, runInAction } from "mobx";
import { WorkspaceService } from "services/workspace.service";
import set from "lodash/set";
import { IWorkspace } from "@plane/types";
import { DataStore } from "./dataMaps";
import { IWorkspaceModel } from "./workspace.store";

export interface IUserModel {
  workspaces: Record<string, IWorkspaceModel>;
}

export class UserModel implements IUserModel {
  workspaces: Record<string, IWorkspaceModel> = {};

  // data store
  data;
  // services
  workspaceService;

  constructor(_data: DataStore) {
    makeObservable(this, {
      workspaces: observable,
    });
    this.data = _data;
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

    this.data.workspace.addWorkspaces(workspaceResponse);
    runInAction(() => {
      workspaceResponse.forEach((workspace) => {
        set(this.workspaces, [workspace.id], this.data.workspace.workspaceMap[workspace.id]);
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
      this.data.workspace.addWorkspaces([response]);
      runInAction(() => {
        set(this.workspaces, [response.id], this.data.workspace.workspaceMap[response.id]);
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
      this.data.workspace.deleteWorkspace(`${workspaceId}`);
      runInAction(() => {
        delete updatedWorkspacesList[`${workspaceId}`];
      });
    });
}
