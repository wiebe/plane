import { action, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { set } from "lodash";
// store
import { DataStore } from ".";
import { WebhookModel } from "store/webhook.store";
// types
import { IWebhook } from "@plane/types";

export interface IWebhookData {
  // observables
  webhookMap: Record<string, WebhookModel>;
  // actions
  addWebhook: (webhooks: IWebhook) => void;
  deleteWebhook: (webhookId: string) => void;
  getWebhookById: (webhookId: string) => WebhookModel | undefined;
}

export class WebhookData implements IWebhookData {
  // observables
  webhookMap: Record<string, WebhookModel> = {};
  // data store
  dataStore;

  constructor(_dataStore: DataStore) {
    makeObservable(this, {
      // observables
      webhookMap: observable,
      // actions
      addWebhook: action,
      deleteWebhook: action,
    });
    this.dataStore = _dataStore;
  }

  /**
   * @description add a webhook to the webhook map
   * @param {IWebhook} webhook
   */
  addWebhook = (webhook: IWebhook) => set(this.webhookMap, [webhook.id], new WebhookModel(webhook, this.dataStore));

  /**
   * @description delete a webhook from the webhook map
   * @param {string} webhookId
   */
  deleteWebhook = (webhookId: string) => delete this.webhookMap[webhookId];

  /**
   * @description get a webhook model by its id
   * @param {string} webhookId
   * @returns {WebhookModel | undefined} webhook model
   */
  getWebhookById = computedFn((webhookId: string) => this.webhookMap[webhookId]);
}
