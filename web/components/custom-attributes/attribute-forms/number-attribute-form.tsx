import Image from "next/image";

// react-hook-form
import { Controller } from "react-hook-form";
// components
import { ColorPicker, FormComponentProps } from "components/custom-attributes";
// ui
import { ToggleSwitch } from "components/ui";
import { Input } from "../input";
// icons
import { CheckCircle2 } from "lucide-react";
// assets
import NumericalRepresentation from "public/custom-attributes/number/numerical.svg";
import BarRepresentation from "public/custom-attributes/number/bar.svg";
import RingRepresentation from "public/custom-attributes/number/ring.svg";

const numberAttributeRepresentations = [
  {
    image: NumericalRepresentation,
    key: "numerical",
    label: "Numerical",
  },
  {
    image: BarRepresentation,
    key: "bar",
    label: "Bar",
  },
  {
    image: RingRepresentation,
    key: "ring",
    label: "Ring",
  },
];

export const NumberAttributeForm: React.FC<FormComponentProps> = ({ control, watch }) => (
  <>
    <div className="space-y-3">
      <Controller
        control={control}
        name="display_name"
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Enter field title" value={value} onChange={onChange} />
        )}
      />
      <Controller
        control={control}
        name="default_value"
        render={({ field: { onChange, value } }) => (
          <Input
            type="number"
            placeholder="Enter default value"
            value={value ?? ""}
            onChange={onChange}
            step={1}
          />
        )}
      />
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
              {numberAttributeRepresentations.map((representation) => (
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
    {watch &&
      (watch("extra_settings.representation") === "bar" ||
        watch("extra_settings.representation") === "ring") && (
        <div className="mt-6 grid grid-cols-3 gap-x-2 gap-y-3 items-center">
          <>
            <div className="text-xs">Divided by</div>
            <div className="col-span-2">
              <Controller
                control={control}
                name="extra_settings.divided_by"
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="number"
                    placeholder="Maximum value"
                    value={value}
                    onChange={onChange}
                    className="hide-arrows"
                    min={0}
                    step={1}
                    required
                  />
                )}
              />
            </div>
          </>
          <>
            <div className="text-xs">Color</div>
            <div className="col-span-2">
              <Controller
                control={control}
                name="color"
                render={({ field: { onChange, value } }) => (
                  <ColorPicker onChange={onChange} selectedColor={value ?? "#000000"} size={18} />
                  // <label htmlFor="numberColorPicker" className="relative block cursor-pointer">
                  //   <Input
                  //     type="color"
                  //     id="numberColorPicker"
                  //     placeholder="Accent color"
                  //     className="hide-color cursor-pointer"
                  //     value={value}
                  //     onChange={(e) => onChange(e.target.value)}
                  //     required
                  //   />
                  //   <span
                  //     className="absolute top-1/2 -translate-y-[65%] left-2 h-5 w-5 rounded pointer-events-none"
                  //     style={{
                  //       backgroundColor: value,
                  //     }}
                  //   />
                  // </label>
                )}
              />
            </div>
          </>
          <>
            <div className="text-xs">Show number</div>
            <div className="col-span-2">
              <Controller
                control={control}
                name="extra_settings.show_number"
                render={({ field: { onChange, value } }) => (
                  <ToggleSwitch value={value} onChange={onChange} />
                )}
              />
            </div>
          </>
        </div>
      )}
  </>
);
