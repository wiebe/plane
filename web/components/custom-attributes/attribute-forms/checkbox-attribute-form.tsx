import Image from "next/image";

// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FormComponentProps, Input } from "components/custom-attributes";
// icons
import { CheckCircle2 } from "lucide-react";
// assets
import CheckRepresentation from "public/custom-attributes/checkbox/check.svg";
import ToggleSwitchRepresentation from "public/custom-attributes/checkbox/toggle-switch.svg";

const checkboxAttributeRepresentations = [
  {
    image: CheckRepresentation,
    key: "check",
    label: "Check",
  },
  {
    image: ToggleSwitchRepresentation,
    key: "toggle_switch",
    label: "Toggle Switch",
  },
];

export const CheckboxAttributeForm: React.FC<FormComponentProps> = ({ control }) => (
  <>
    <div className="space-y-3">
      {" "}
      <Controller
        control={control}
        name="display_name"
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Enter field title" value={value} onChange={onChange} />
        )}
      />
      <div>
        <p className="text-xs">Default value</p>
        <div className="mt-2 flex items-center gap-6 accent-custom-primary-100">
          <div className="flex items-center gap-1 text-xs">
            <input
              type="radio"
              name="default_value"
              value="checked"
              id="checked"
              className="scale-75"
              defaultChecked
            />
            <label htmlFor="checked">Checked</label>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <input
              type="radio"
              name="default_value"
              value="unchecked"
              id="unchecked"
              className="scale-75"
            />
            <label htmlFor="unchecked">Unchecked</label>
          </div>
        </div>
      </div>
    </div>
    <div className="my-3 border-t-[0.5px] border-custom-border-200" />
    <div>
      <h6 className="text-xs">Show as</h6>
      <div className="mt-2 flex items-center gap-4 flex-wrap">
        <Controller
          control={control}
          name="extra_settings.representation"
          render={({ field: { onChange, value } }) => (
            <>
              {checkboxAttributeRepresentations.map((representation) => (
                <div
                  key={representation.key}
                  className={`rounded divide-y w-32 cursor-pointer border ${
                    value === representation.key
                      ? "border-custom-primary-100 divide-custom-primary-100"
                      : "border-custom-border-200 divide-custom-border-200"
                  }`}
                  onClick={() => onChange(representation.key)}
                >
                  <div className="h-24 p-2.5 grid place-items-center">
                    <Image src={representation.image} alt={representation.label} />
                  </div>
                  <div className="h-9 text-xs font-medium p-2.5 bg-custom-background-100 rounded-b flex items-center justify-between gap-2">
                    {representation.label}
                    {value === representation.key && (
                      <CheckCircle2
                        size={14}
                        strokeWidth={1.5}
                        className="text-custom-primary-100"
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        />
      </div>
    </div>
  </>
);
