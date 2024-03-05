import { action, computed, makeObservable, observable, runInAction } from "mobx";
import set from "lodash/set";
import { DataStore } from "./dataMaps";
// services
import { WorkspaceService } from "services/workspace.service";
import { WebhookService } from "services/webhook.service";
import { APITokenService } from "services/api_token.service";
// types
import { IApiToken, IUser, IWebhook, IWorkspace } from "@plane/types";
import { IWebhookModel } from "./webhook.store";
import { IAPITokenModel } from "./api-token.store";

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
  // data maps
  webhooks: Record<string, IWebhookModel>;
  apiTokens: Record<string, IAPITokenModel>;
  // computed
  asJSON: IWorkspace;
  // workspace actions
  updateWorkspace: (data: Partial<IWorkspace>) => Promise<IWorkspace>;
  // webhook actions
  fetchWebhooks: () => Promise<IWebhook[]>;
  createWebhook: (data: Partial<IWebhook>) => Promise<IWebhook>;
  deleteWebhook: (webhookId: string) => Promise<void>;
  // API token actions
  fetchApiTokens: () => Promise<IApiToken[]>;
  createApiToken: (data: Partial<IApiToken>) => Promise<IApiToken>;
  deleteApiToken: (tokenId: string) => Promise<void>;
}

export class WorkspaceModel implements IWorkspaceModel {
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
  updated_at: Date;
  updated_by: string;
  url: string;
  // data maps
  webhooks: Record<string, IWebhookModel> = {};
  apiTokens: Record<string, IAPITokenModel> = {};
  // root store
  dataStore;
  // services
  workspaceService;
  webhookService;
  apiTokenService;

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
      // data maps
      webhooks: observable,
      apiTokens: observable,
      // computed
      asJSON: computed,
      // workspace actions
      updateWorkspace: action,
      // webhook actions
      fetchWebhooks: action,
      createWebhook: action,
      deleteWebhook: action,
      // API token actions
      fetchApiTokens: action,
      createApiToken: action,
      deleteApiToken: action,
    });
    this.dataStore = _dataStore;
    // services
    this.workspaceService = new WorkspaceService();
    this.webhookService = new WebhookService();
    this.apiTokenService = new APITokenService();

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
  get asJSON() {
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
   * @param {Partial<IWorkspace>} data
   */
  updateWorkspace = async (data: Partial<IWorkspace>) => {
    const originalData = this.asJSON;
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

  // webhook actions

  /**
   * @description fetch all the webhooks of the workspace
   */
  fetchWebhooks = async () => {
    const webhooksResponse = await this.webhookService.fetchWebhooksList(this.slug);

    runInAction(() => {
      webhooksResponse.forEach((webhook) => {
        this.dataStore.webhook.addWebhook(webhook);
        set(this.webhooks, [webhook.id], this.dataStore.webhook.webhookMap[webhook.id]);
      });
    });
    return webhooksResponse;
  };

  /**
   * @description create webhook using the webhook data
   * @param {Partial<IWebhook>} data
   */
  createWebhook = async (data: Partial<IWebhook>) =>
    await this.webhookService.createWebhook(this.slug, data).then((response) => {
      runInAction(() => {
        this.dataStore.webhook.addWebhook(response);
        set(this.webhooks, [response.id], this.dataStore.webhook.webhookMap[response.id]);
      });
      return response;
    });

  /**
   * @description delete a webhook using webhook id
   * @param {string} webhookId
   */
  deleteWebhook = async (webhookId: string) =>
    await this.webhookService.deleteWebhook(this.slug, webhookId).then(() => {
      this.dataStore.webhook.deleteWebhook(webhookId);
      runInAction(() => {
        delete this.webhooks[webhookId];
      });
    });

  // API token actions

  /**
   * @description fetch all the API tokens of the workspace
   */
  fetchApiTokens = async () => {
    const apiTokensResponse = await this.apiTokenService.getApiTokens(this.slug);

    runInAction(() => {
      apiTokensResponse.forEach((apiToken) => {
        this.dataStore.apiToken.addAPIToken(apiToken);
        set(this.apiTokens, [apiToken.id], this.dataStore.apiToken.apiTokenMap[apiToken.id]);
      });
    });
    return apiTokensResponse;
  };

  /**
   * @description create API token using data
   * @param {Partial<IApiToken>} data
   */
  createApiToken = async (data: Partial<IApiToken>) =>
    await this.apiTokenService.createApiToken(this.slug, data).then((response) => {
      runInAction(() => {
        this.dataStore.apiToken.addAPIToken(response);
        set(this.apiTokens, [response.id], this.dataStore.apiToken.apiTokenMap[response.id]);
      });
      return response;
    });

  /**
   * @description delete API token using token id
   * @param {string} tokenId
   */
  deleteApiToken = async (tokenId: string) =>
    await this.apiTokenService.deleteApiToken(this.slug, tokenId).then(() => {
      this.dataStore.apiToken.deleteAPIToken(tokenId);
      runInAction(() => {
        delete this.apiTokens[tokenId];
      });
    });
}
