import Image from "next/image";

// headless ui
import { Disclosure } from "@headlessui/react";
// ui
import { ToggleSwitch } from "components/ui";
import { Input } from "../input";
// icons
import { CheckCircle2, ChevronDown } from "lucide-react";
// assets
import NumericalRepresentation from "public/custom-attributes/number/numerical.svg";
import BarRepresentation from "public/custom-attributes/number/bar.svg";
import RingRepresentation from "public/custom-attributes/number/ring.svg";
// types
import { ICustomAttribute, TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";
import { Controller, useForm } from "react-hook-form";

type Props = {};

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

const defaultFormValues: Partial<ICustomAttribute> = {
  default_value: "",
  display_name: "",
  extra_settings: {
    color: "Blue",
    divided_by: 100,
    representation: "numerical",
    show_number: true,
  },
  is_required: false,
};

export const NumberAttributeForm: React.FC<Props> = () => {
  const { control, watch } = useForm({ defaultValues: defaultFormValues });

  const typeMetaData = CUSTOM_ATTRIBUTES_LIST.number;

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
                      value={value}
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
              {(watch("extra_settings.representation") === "bar" ||
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
                            step={1}
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
                        name="extra_settings.color"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            type="text"
                            placeholder="Accent color"
                            value={value}
                            onChange={onChange}
                          />
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
