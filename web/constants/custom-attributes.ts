// components
import {
  CheckboxAttributeForm,
  DateTimeAttributeForm,
  EmailAttributeForm,
  FileAttributeForm,
  NumberAttributeForm,
  RelationAttributeForm,
  SelectAttributeForm,
  TextAttributeForm,
  UrlAttributeForm,
} from "components/custom-attributes";
// icons
import {
  AtSign,
  Baseline,
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
import { TCustomAttributeTypes, TCustomAttributeUnits } from "types";

export const CUSTOM_ATTRIBUTES_LIST: {
  [key in Partial<TCustomAttributeTypes>]: {
    component: React.FC<any>;
    icon: LucideIcon;
    label: string;
  };
} = {
  checkbox: {
    component: CheckboxAttributeForm,
    icon: CheckCircle,
    label: "Checkbox",
  },
  datetime: {
    component: DateTimeAttributeForm,
    icon: Clock4,
    label: "Date Time",
  },
  email: {
    component: EmailAttributeForm,
    icon: AtSign,
    label: "Email",
  },
  files: {
    component: FileAttributeForm,
    icon: FileMinus,
    label: "Files",
  },
  multi_select: {
    component: SelectAttributeForm,
    icon: Disc,
    label: "Multi Select",
  },
  number: {
    component: NumberAttributeForm,
    icon: Hash,
    label: "Number",
  },
  option: {
    icon: Baseline,
    label: "Option",
  },
  relation: {
    component: RelationAttributeForm,
    icon: Forward,
    label: "Relation",
  },
  select: {
    component: SelectAttributeForm,
    icon: Disc,
    label: "Select",
  },
  text: {
    component: TextAttributeForm,
    icon: CaseSensitive,
    label: "Text",
  },
  url: {
    component: UrlAttributeForm,
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
