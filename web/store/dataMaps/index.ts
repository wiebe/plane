import { IWebhookData, WebhookData } from "./webhook.data.store";
import { IWorkspaceData, WorkspaceData } from "./workspace.data.store";

export class DataStore {
  workspace: IWorkspaceData;
  webhook: IWebhookData;

  constructor() {
    this.workspace = new WorkspaceData(this);
    this.webhook = new WebhookData(this);
  }

  resetOnSignOut() {}
}
