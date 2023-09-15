// ui
import { ToggleSwitch } from "components/ui";
// types
import { Props } from "./types";

export const CustomCheckboxAttribute: React.FC<Props & { value: boolean }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const handleUpdateCheckbox = (val: boolean | string) => onChange(val.toString());

  return (
    <div className="bg-custom-background-80 flex items-center gap-2 rounded px-2.5 py-0.5 text-xs">
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
      <span>{attributeDetails.display_name}</span>
    </div>
  );
};
