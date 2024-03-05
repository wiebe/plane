import { makeObservable, observable } from "mobx";
import { DataStore } from ".";
import { TIssue } from "@plane/types";
import { set } from "lodash";

export interface IIssueData {
  issueMap: Record<string, any>;

  addIssue: (issue: TIssue) => void;
  deleteIssue: (issueId: string) => void;
  getIssuebyId: (issueId: string) => any | undefined;
}

export class IssueData implements IIssueData {
  issueMap: Record<string, any> = {};

  // data store
  dataStore;

  constructor(_dataStore: DataStore) {
    makeObservable(this, {
      issueMap: observable,
    });
    this.dataStore = _dataStore;
  }

  addIssue = (issue: TIssue) => {
    set(this.issueMap, [issue.id], "");
  };

  deleteIssue = (issueId: string) => {
    delete this.issueMap[issueId];
  };

  getIssuebyId = (issueId: string) => this.issueMap[issueId];
}
