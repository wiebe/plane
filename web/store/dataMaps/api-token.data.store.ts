import { action, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { set } from "lodash";
// store
import { DataStore } from ".";
import { APIModel } from "store/api-token.store";
// types
import { IApiToken } from "@plane/types";

export interface IAPITokenData {
  // observables
  apiTokenMap: Record<string, APIModel>;
  // actions
  addAPIToken: (apiToken: IApiToken) => void;
  deleteAPIToken: (apiTokenId: string) => void;
  getAPITokenById: (apiTokenId: string) => APIModel | undefined;
}

export class APITokenData implements IAPITokenData {
  // observables
  apiTokenMap: Record<string, APIModel> = {};
  // data store
  dataStore;

  constructor(_dataStore: DataStore) {
    makeObservable(this, {
      // observables
      apiTokenMap: observable,
      // actions
      addAPIToken: action,
      deleteAPIToken: action,
    });
    this.dataStore = _dataStore;
  }

  /**
   * @description add a API token to the API token map
   * @param {IApiToken} apiToken
   */
  addAPIToken = (apiToken: IApiToken) => set(this.apiTokenMap, [apiToken.id], new APIModel(apiToken, this.dataStore));

  /**
   * @description delete a API token from the API token map
   * @param {string} apiTokenId
   */
  deleteAPIToken = (apiTokenId: string) => delete this.apiTokenMap[apiTokenId];

  /**
   * @description get a API token model by its id
   * @param {string} apiTokenId
   * @returns {APIModel | undefined} API token model
   */
  getAPITokenById = computedFn((apiTokenId: string) => this.apiTokenMap[apiTokenId]);
}
