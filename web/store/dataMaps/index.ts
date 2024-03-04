import { IWorkspaceData, WorkspaceData } from "./workspace.data.store";

export class DataStore {
  workspace: IWorkspaceData;

  constructor() {
    this.workspace = new WorkspaceData(this);
  }

  resetOnSignout() {}
}
