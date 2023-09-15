export type TCustomAttributeTypes =
  | "checkbox"
  | "datetime"
  | "email"
  | "entity"
  | "file"
  | "multi_select"
  | "number"
  | "option"
  | "relation"
  | "select"
  | "text"
  | "url";

export type TCustomAttributeUnits = "cycle" | "issue" | "module" | "user" | null;

// export type TCustomAttributeExtraSettings =
//   | {
//       type: "checkbox";
//       extra_settings: {
//         representation: "check" | "toggle_switch";
//       };
//     }
//   | {
//       type: "datetime";
//       extra_settings: {
//         date_format: "DD-MM-YYYY" | "MM-DD-YYYY" | "YYYY-MM-DD";
//         hide_date: boolean;
//         hide_time: boolean;
//         time_format: "12" | "24";
//       };
//     }
//   | {
//       type: "number";
//       extra_settings: {
//         divided_by: number;
//         representation: "numerical" | "bar" | "ring";
//         show_number: boolean;
//       };
//     };

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
        type: 0 | 1;
        value: string;
      }[]
    | null;
  prop_extra:
    | {
        id: string;
        name: string;
      }[]
    | null;
  type: TCustomAttributeTypes;
  unit: TCustomAttributeUnits;
}

export interface ICustomAttributeValueFormData {
  issue_properties: {
    [key: string]: string[];
  };
  a_epoch?: number;
}
