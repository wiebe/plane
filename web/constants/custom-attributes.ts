// icons
import {
  AtSign,
  CaseSensitive,
  CheckCircle,
  Clock4,
  Disc,
  FileMinus,
  Forward,
  Hash,
  Link2,
  LucideIcon,
} from "lucide-react";
// types
import { ICustomAttribute, TCustomAttributeTypes, TCustomAttributeUnits } from "types";

export const CUSTOM_ATTRIBUTES_LIST: {
  [key in Partial<TCustomAttributeTypes>]: {
    defaultFormValues: Partial<ICustomAttribute>;
    icon: LucideIcon;
    initialPayload?: Partial<ICustomAttribute>;
    label: string;
  };
} = {
  checkbox: {
    defaultFormValues: {
      default_value: "true",
      display_name: "",
      extra_settings: {
        representation: "check",
      },
      is_required: false,
    },
    icon: CheckCircle,
    initialPayload: {
      default_value: "checked",
      extra_settings: {
        representation: "check",
      },
    },
    label: "Checkbox",
  },
  datetime: {
    defaultFormValues: {
      default_value: "",
      display_name: "",
      extra_settings: {
        date_format: "DD-MM-YYYY",
        time_format: "12",
      },
      is_required: false,
    },
    icon: Clock4,
    initialPayload: {
      extra_settings: {
        date_format: "DD-MM-YYYY",
        hide_date: false,
        hide_time: false,
        time_format: "12",
      },
    },
    label: "Date Time",
  },
  email: {
    defaultFormValues: { default_value: "", display_name: "", is_required: false },
    icon: AtSign,
    label: "Email",
  },
  file: {
    defaultFormValues: {
      display_name: "",
      extra_settings: {
        file_formats: [],
      },
      is_multi: false,
      is_required: false,
    },
    icon: FileMinus,
    label: "File",
    initialPayload: {
      extra_settings: {
        file_formats: [".jpg", ".jpeg"],
      },
    },
  },
  multi_select: {
    defaultFormValues: { default_value: "", display_name: "", is_multi: true, is_required: false },
    icon: Disc,
    initialPayload: { is_multi: true },
    label: "Multi Select",
  },
  number: {
    defaultFormValues: {
      color: "#000000",
      default_value: "",
      display_name: "",
      extra_settings: {
        divided_by: 100,
        representation: "numerical",
        show_number: true,
      },
      is_required: false,
    },
    icon: Hash,
    label: "Number",
    initialPayload: {
      extra_settings: {
        representation: "numerical",
      },
    },
  },
  relation: {
    defaultFormValues: { display_name: "", is_multi: false, is_required: false, unit: "cycle" },
    icon: Forward,
    label: "Relation",
    initialPayload: {
      unit: "cycle",
    },
  },
  select: {
    defaultFormValues: { default_value: "", display_name: "", is_required: false },
    icon: Disc,
    label: "Select",
  },
  text: {
    defaultFormValues: { default_value: "", display_name: "", is_required: false },
    icon: CaseSensitive,
    label: "Text",
  },
  url: {
    defaultFormValues: { default_value: "", display_name: "", is_required: false },
    icon: Link2,
    label: "URL",
  },
};

export const CUSTOM_ATTRIBUTE_UNITS: {
  label: string;
  value: TCustomAttributeUnits;
}[] = [
  {
    label: "Cycle",
    value: "cycle",
  },
  {
    label: "Issue",
    value: "issue",
  },
  {
    label: "Module",
    value: "module",
  },
  {
    label: "User",
    value: "user",
  },
];

export const DATE_FORMATS = [
  { label: "Day/Month/Year", value: "DD-MM-YYYY" },
  { label: "Month/Day/Year", value: "MM-DD-YYYY" },
  { label: "Year/Month/Day", value: "YYYY-MM-DD" },
];

export const TIME_FORMATS = [
  { label: "12 Hours", value: "12" },
  { label: "24 Hours", value: "24" },
];
