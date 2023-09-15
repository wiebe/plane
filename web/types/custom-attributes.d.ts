export type TCustomAttributeTypes =
  | "checkbox"
  | "datetime"
  | "email"
  | "entity"
  | "files"
  | "multi_select"
  | "number"
  | "option"
  | "relation"
  | "select"
  | "text"
  | "url";

export type TCustomAttributeUnits = "cycle" | "issue" | "module" | "user" | null;

export interface ICustomAttribute {
  children: ICustomAttribute[];
  color: string;
  default_value: string;
  description: string;
  display_name: string;
  extra_settings: { [key: string]: any };
  icon: string | null;
  id: string;
  is_default: boolean;
  is_multi: boolean;
  is_required: boolean;
  parent: string | null;
  project: string | null;
  sort_order: number;
  type: TCustomAttributeTypes;
  unit: TCustomAttributeUnits;
  workspace: string;
}

export interface ICustomAttributeValue {
  children: ICustomAttributeValue[];
  id: string;
  name: string;
  prop_value:
    | {
        type: string;
        value: string;
      }[]
    | null;
  type: TCustomAttributeTypes;
  unit: TCustomAttributeUnits;
}

export interface ICustomAttributeValueFormData {
  issue_properties: {
    [key: string]: string;
  };
  a_epoch?: number;
}
