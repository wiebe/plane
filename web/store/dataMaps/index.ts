import { IWorkspaceData, WorkspaceData } from "./workspace.data.store";

export class DataStore {
  workspaceData: IWorkspaceData;

  constructor() {
    this.workspaceData = new WorkspaceData(this);
  }

  resetOnSignout() {}
}
