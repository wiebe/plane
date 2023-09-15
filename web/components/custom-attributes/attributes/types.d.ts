// types
import { ICustomAttribute } from "types";

export type Props = {
  attributeDetails: ICustomAttribute;
  issueId: string;
  onChange: (value: any) => void;
  projectId: string;
};
