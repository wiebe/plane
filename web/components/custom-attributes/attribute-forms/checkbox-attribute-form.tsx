import Image from "next/image";

// react-hook-form
import { Controller, useForm } from "react-hook-form";
// headless ui
import { Disclosure } from "@headlessui/react";
// ui
import { ToggleSwitch } from "components/ui";
import { Input } from "../input";
// icons
import { CheckCircle2, ChevronDown } from "lucide-react";
// assets
import CheckRepresentation from "public/custom-attributes/checkbox/check.svg";
import ToggleSwitchRepresentation from "public/custom-attributes/checkbox/toggle-switch.svg";
// types
import { ICustomAttribute, TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {};

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

const defaultFormValues: Partial<ICustomAttribute> = {
  default_value: "checked",
  display_name: "",
  extra_settings: {
    representation: "check",
  },
  is_required: false,
};

export const CheckboxAttributeForm: React.FC<Props> = () => {
  const { control, watch } = useForm({ defaultValues: defaultFormValues });

  const typeMetaData = CUSTOM_ATTRIBUTES_LIST.checkbox;

  return (
    <Disclosure
      as="div"
      className="bg-custom-background-90 border border-custom-border-200 rounded"
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="p-3 flex items-center justify-between gap-1 w-full">
            <div className="flex items-center gap-2.5">
              <typeMetaData.icon size={14} strokeWidth={1.5} />
              <h6 className="text-sm">{typeMetaData.label}</h6>
            </div>
            <div className={`${open ? "-rotate-180" : ""} transition-all`}>
              <ChevronDown size={16} strokeWidth={1.5} rotate="180deg" />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel>
            <form className="p-3 pl-9 pt-0">
              <div className="space-y-3">
                <Input placeholder="Enter field title" />
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
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="is_required"
                    render={({ field: { onChange, value } }) => (
                      <ToggleSwitch value={value ?? false} onChange={onChange} />
                    )}
                  />
                  <span className="text-xs">Mandatory field</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium px-3 py-2 rounded bg-custom-background-100 border border-custom-border-200"
                >
                  Remove
                </button>
              </div>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
