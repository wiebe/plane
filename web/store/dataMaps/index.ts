import { IIssueData, IssueData } from "./issue.data.store";
import { IWorkspaceData, WorkspaceData } from "./workspace.data.store";

export class DataStore {
  workspace: IWorkspaceData;
  issue: IIssueData;

  constructor() {
    this.workspace = new WorkspaceData(this);
    this.issue = new IssueData(this);
  }

  resetOnSignout() {}
}
