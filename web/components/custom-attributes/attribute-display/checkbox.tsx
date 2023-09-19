// ui
import { ToggleSwitch } from "components/ui";
// types
import { ICustomAttribute } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  issueId: string;
  projectId: string;
  value: boolean;
  onChange: (val: boolean) => void;
};

export const CustomCheckboxAttribute: React.FC<Props & { value: boolean }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const handleUpdateCheckbox = (val: boolean) => onChange(val);

  return (
    <div className="text-xs truncate">
      {attributeDetails.extra_settings.representation === "toggle_switch" ? (
        <ToggleSwitch value={value ?? false} onChange={handleUpdateCheckbox} />
      ) : (
        <div className="flex-shrink-0 flex items-center">
          <input
            type="checkbox"
            defaultChecked={value}
            onChange={(e) => handleUpdateCheckbox(e.target.checked)}
          />
        </div>
      )}
    </div>
  );
};
