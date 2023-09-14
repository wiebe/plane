// types
import { ICustomAttribute } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  issueId: string;
  onChange: (value: string) => void;
  projectId: string;
  value: string;
};

export const CustomTextAttribute: React.FC<Props> = ({
  attributeDetails,
  issueId,
  onChange,
  value,
}) => (
  <input
    className="border border-custom-border-200 rounded outline-none p-1 text-xs"
    defaultValue={attributeDetails.default_value ?? ""}
    id={`attribute-${attributeDetails.display_name}-${attributeDetails.id}`}
    name={`attribute-${attributeDetails.display_name}-${attributeDetails.id}`}
    onChange={(e) => onChange(e.target.value)}
    value={value}
  />
);
