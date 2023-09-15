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
    <>
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
    </>
  );
};
