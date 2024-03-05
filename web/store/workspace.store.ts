import { action, computed, makeObservable, observable, runInAction } from "mobx";
import set from "lodash/set";
import { DataStore } from "./dataMaps";
// services
import { WorkspaceService } from "services/workspace.service";
// types
import { IUser, IWorkspace } from "@plane/types";

export interface IWorkspaceModel {
  // model observables
  created_at: Date;
  created_by: string;
  id: string;
  logo: string | null;
  name: string;
  organization_size: string;
  owner: IUser;
  slug: string;
  total_issues: number;
  total_members: number;
  url: string;
  updated_at: Date;
  updated_by: string;
  // computed
  toJSON: IWorkspace;
  // actions
  updateWorkspace: (data: Partial<IWorkspace>) => Promise<IWorkspace>;
}

export class WorkspaceModel implements IWorkspaceModel {
  created_at: Date;
  created_by: string;
  id: string;
  logo: string | null;
  name: string;
  organization_size: string;
  owner: IUser;
  slug: string;
  total_issues: number;
  total_members: number;
  updated_at: Date;
  updated_by: string;
  url: string;
  // root store
  dataStore;
  // services
  workspaceService;

  constructor(workspace: IWorkspace, _dataStore: DataStore) {
    makeObservable(this, {
      // model observables
      created_at: observable.ref,
      created_by: observable.ref,
      id: observable.ref,
      logo: observable.ref,
      name: observable.ref,
      organization_size: observable.ref,
      owner: observable.ref,
      slug: observable.ref,
      total_issues: observable.ref,
      total_members: observable.ref,
      updated_at: observable.ref,
      updated_by: observable.ref,
      url: observable.ref,
      // computed
      toJSON: computed,
      // actions
      updateWorkspace: action,
    });
    this.dataStore = _dataStore;
    // services
    this.workspaceService = new WorkspaceService();

    this.created_at = workspace.created_at;
    this.created_by = workspace.created_by;
    this.id = workspace.id;
    this.logo = workspace.logo;
    this.name = workspace.name;
    this.organization_size = workspace.organization_size;
    this.owner = workspace.owner;
    this.slug = workspace.slug;
    this.total_issues = workspace.total_issues;
    this.total_members = workspace.total_members;
    this.updated_at = workspace.updated_at;
    this.updated_by = workspace.updated_by;
    this.url = workspace.url;
  }

  /**
   * @description returns the workspace data in JSON format
   */
  get toJSON() {
    return {
      created_at: this.created_at,
      created_by: this.created_by,
      id: this.id,
      logo: this.logo,
      name: this.name,
      organization_size: this.organization_size,
      owner: this.owner,
      slug: this.slug,
      total_issues: this.total_issues,
      total_members: this.total_members,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      url: this.url,
    };
  }

  /**
   * @description update workspace using the new workspace data
   * @param data
   */
  updateWorkspace = async (data: Partial<IWorkspace>) => {
    const originalData = { ...this };
    // optimistically update the store
    runInAction(() => {
      Object.entries(data).forEach(([key, value]) => {
        set(this, [key], value);
      });
    });

    try {
      const response = await this.workspaceService.updateWorkspace(this.slug, data);
      return response;
    } catch (error) {
      // revert the store back to the original state
      runInAction(() => {
        Object.keys(data).forEach((key) => {
          set(this, [key], originalData[key as keyof IWorkspace]);
        });
      });
      throw error;
    }
  };
}
