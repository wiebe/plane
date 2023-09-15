// mobx lite
import { enableStaticRendering } from "mobx-react-lite";
// store imports
import UserStore from "./user";
import ThemeStore from "./theme";
import ProjectStore, { IProjectStore } from "./project";
import ProjectPublishStore, { IProjectPublishStore } from "./project-publish";
import IssuesStore from "./issues";
import CustomAttributesStore from "./custom-attributes";
import CustomAttributeValuesStore from "./custom-attribute-values";

enableStaticRendering(typeof window === "undefined");

export class RootStore {
  user;
  theme;
  project: IProjectStore;
  projectPublish: IProjectPublishStore;
  issues: IssuesStore;
  customAttributes: CustomAttributesStore;
  customAttributeValues: CustomAttributeValuesStore;

  constructor() {
    this.user = new UserStore(this);
    this.theme = new ThemeStore(this);
    this.project = new ProjectStore(this);
    this.projectPublish = new ProjectPublishStore(this);
    this.issues = new IssuesStore(this);
    this.customAttributes = new CustomAttributesStore(this);
    this.customAttributeValues = new CustomAttributeValuesStore(this);
  }
}
