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

export type TCustomAttributeUnits = "cycle" | "issue" | "module" | "user";

export interface ICustomAttribute {
  color: string;
  default_value: string;
  description: string;
  display_name: string;
  extra_settings: any;
  icon: string;
  id: string;
  is_default: boolean;
  is_multi: boolean;
  is_required: boolean;
  is_shared: boolean;
  parent: string;
  sort_order: number;
  type: TCustomAttributeTypes;
  unit: TCustomAttributeUnits;
}
