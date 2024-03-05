import { computed, makeObservable, observable } from "mobx";
import { DataStore } from "./dataMaps";
// services
import { APITokenService } from "services/api_token.service";
// types
import { IApiToken } from "@plane/types";

export interface IAPITokenModel {
  // model observables
  created_at: string;
  created_by: string;
  description: string;
  expired_at: string | null;
  id: string;
  is_active: boolean;
  label: string;
  last_used: string | null;
  updated_at: string;
  updated_by: string;
  user: string;
  user_type: number;
  token?: string;
  workspace: string;
  // computed
  asJSON: IApiToken;
}

export class APIModel implements IAPITokenModel {
  // model observables
  created_at: string;
  created_by: string;
  description: string;
  expired_at: string | null;
  id: string;
  is_active: boolean;
  label: string;
  last_used: string | null;
  updated_at: string;
  updated_by: string;
  user: string;
  user_type: number;
  token?: string;
  workspace: string;
  // root store
  dataStore;
  // services
  apiTokenService;

  constructor(apiToken: IApiToken, _dataStore: DataStore) {
    makeObservable(this, {
      // model observables
      created_at: observable.ref,
      created_by: observable.ref,
      description: observable.ref,
      expired_at: observable.ref,
      id: observable.ref,
      is_active: observable.ref,
      label: observable.ref,
      last_used: observable.ref,
      updated_at: observable.ref,
      updated_by: observable.ref,
      user: observable.ref,
      user_type: observable.ref,
      token: observable.ref,
      workspace: observable.ref,
      // computed
      asJSON: computed,
    });
    this.dataStore = _dataStore;
    // services
    this.apiTokenService = new APITokenService();

    this.created_at = apiToken.created_at;
    this.created_by = apiToken.created_by;
    this.description = apiToken.description;
    this.expired_at = apiToken.expired_at;
    this.id = apiToken.id;
    this.is_active = apiToken.is_active;
    this.label = apiToken.label;
    this.last_used = apiToken.last_used;
    this.updated_at = apiToken.updated_at;
    this.updated_by = apiToken.updated_by;
    this.user = apiToken.user;
    this.user_type = apiToken.user_type;
    this.token = apiToken.token;
    this.workspace = apiToken.workspace;
  }

  /**
   * @description returns the API token data in JSON format
   */
  get asJSON() {
    return {
      created_at: this.created_at,
      created_by: this.created_by,
      description: this.description,
      expired_at: this.expired_at,
      id: this.id,
      is_active: this.is_active,
      label: this.label,
      last_used: this.last_used,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
      user: this.user,
      user_type: this.user_type,
      token: this.token,
      workspace: this.workspace,
    };
  }
}
