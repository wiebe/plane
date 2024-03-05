import { action, computed, makeObservable, observable, runInAction } from "mobx";
import set from "lodash/set";
import { DataStore } from "./dataMaps";
// services
import { WebhookService } from "services/webhook.service";
// types
import { IWebhook } from "@plane/types";

export interface IWebhookModel {
  // model observables
  created_at: string;
  cycle: boolean;
  id: string;
  is_active: boolean;
  issue: boolean;
  issue_comment: boolean;
  module: boolean;
  project: boolean;
  secret_key?: string;
  updated_at: string;
  url: string;
  // computed
  asJSON: IWebhook;
  // actions
  updateWebhook: (workspaceSlug: string, data: Partial<IWebhook>) => Promise<IWebhook>;
}

export class WebhookModel implements IWebhookModel {
  // model observables
  created_at: string;
  cycle: boolean;
  id: string;
  is_active: boolean;
  issue: boolean;
  issue_comment: boolean;
  module: boolean;
  project: boolean;
  secret_key?: string;
  updated_at: string;
  url: string;
  // root store
  dataStore;
  // services
  webhookService;

  constructor(webhook: IWebhook, _dataStore: DataStore) {
    makeObservable(this, {
      // model observables
      created_at: observable.ref,
      cycle: observable.ref,
      id: observable.ref,
      is_active: observable.ref,
      issue: observable.ref,
      issue_comment: observable.ref,
      module: observable.ref,
      project: observable.ref,
      secret_key: observable.ref,
      updated_at: observable.ref,
      url: observable.ref,
      // computed
      asJSON: computed,
      // actions
      updateWebhook: action,
    });
    this.dataStore = _dataStore;

    // services
    this.webhookService = new WebhookService();

    this.created_at = webhook.created_at;
    this.cycle = webhook.cycle;
    this.id = webhook.id;
    this.is_active = webhook.is_active;
    this.issue = webhook.issue;
    this.issue_comment = webhook.issue_comment;
    this.module = webhook.module;
    this.project = webhook.project;
    this.secret_key = webhook.secret_key;
    this.updated_at = webhook.updated_at;
    this.url = webhook.url;
  }

  /**
   * @description returns the webhook data in JSON format
   */
  get asJSON() {
    return {
      created_at: this.created_at,
      cycle: this.cycle,
      id: this.id,
      is_active: this.is_active,
      issue: this.issue,
      issue_comment: this.issue_comment,
      module: this.module,
      project: this.project,
      secret_key: this.secret_key,
      updated_at: this.updated_at,
      url: this.url,
    };
  }

  /**
   * @description update a webhook using the data
   * @param {string} workspaceSlug
   * @param {Partial<IWebhook>} data
   */
  updateWebhook = async (workspaceSlug: string, data: Partial<IWebhook>) => {
    const originalData = this.asJSON;
    // optimistically update the store
    runInAction(() => {
      Object.entries(data).forEach(([key, value]) => {
        set(this, [key], value);
      });
    });

    try {
      const response = await this.webhookService.updateWebhook(workspaceSlug, this.id, data);
      return response;
    } catch (error) {
      // revert the store back to the original state
      runInAction(() => {
        Object.keys(data).forEach((key) => {
          set(this, [key], originalData[key as keyof IWebhook]);
        });
      });
      throw error;
    }
  };
}
