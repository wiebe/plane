import { IIssueData, IssueData } from "./issue.data.store";
import { APITokenData, IAPITokenData } from "./api-token.data.store";
import { IWebhookData, WebhookData } from "./webhook.data.store";
import { IWorkspaceData, WorkspaceData } from "./workspace.data.store";

export class DataStore {
  workspace: IWorkspaceData;
  issue: IIssueData;
  webhook: IWebhookData;
  apiToken: IAPITokenData;

  constructor() {
    this.workspace = new WorkspaceData(this);
    this.webhook = new WebhookData(this);
    this.apiToken = new APITokenData(this);
    
    this.issue = new IssueData(this);
  }

  resetOnSignOut() {}
}
