import { DataStore } from "./dataMaps";
import { IUserModel, UserModel } from "./user.model";

export class RootStore {
  data: DataStore;

  user: IUserModel;

  constructor() {
    this.data = new DataStore();

    this.user = new UserModel(this.data);
  }

  resetOnSignout() {}
}
