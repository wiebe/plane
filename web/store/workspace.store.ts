import { makeObservable, observable } from "mobx";
import { IUser, IWorkspace } from "@plane/types";
import { DataStore } from "./dataMaps";

export interface IWorkspaceModel {
  id: string;
  owner: IUser;
  created_at: Date;
  updated_at: Date;
  name: string;
  url: string;
  logo: string | null;
  total_members: number;
  slug: string;
  created_by: string;
  updated_by: string;
  organization_size: string;
  total_issues: number;
}

export class WorkspaceModel implements IWorkspaceModel {
  id: string;
  owner: IUser;
  created_at: Date;
  updated_at: Date;
  name: string;
  url: string;
  logo: string | null;
  total_members: number;
  slug: string;
  created_by: string;
  updated_by: string;
  organization_size: string;
  total_issues: number;

  // root store
  dataStore;

  constructor(workspace: IWorkspace, _dataStore: DataStore) {
    makeObservable(this, {
      name: observable.ref,
      url: observable.ref,
      logo: observable.ref,
    });
    this.dataStore = _dataStore;

    this.id = workspace.id;
    this.owner = workspace.owner;
    this.created_at = workspace.created_at;
    this.updated_at = workspace.updated_at;
    this.name = workspace.name;
    this.url = workspace.url;
    this.logo = workspace.logo;
    this.total_members = workspace.total_members;
    this.slug = workspace.slug;
    this.created_by = workspace.created_by;
    this.updated_by = workspace.updated_by;
    this.organization_size = workspace.organization_size;
    this.total_issues = workspace.total_issues;
  }

  get toJSON() {
    return {
      id: this.id,
      owner: this.owner,
      created_at: this.created_at,
      updated_at: this.updated_at,
      name: this.name,
      url: this.url,
      logo: this.logo,
      total_members: this.total_members,
      slug: this.slug,
      created_by: this.created_by,
      updated_by: this.updated_by,
      organization_size: this.organization_size,
      total_issues: this.total_issues,
    };
  }
}
