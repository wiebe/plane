// react-hook-form
import { Controller, useForm } from "react-hook-form";
// headless ui
import { Disclosure } from "@headlessui/react";
// components
import { FileFormatsDropdown } from "components/custom-attributes";
// ui
import { ToggleSwitch } from "components/ui";
import { Input } from "../input";
// icons
import { ChevronDown } from "lucide-react";
// types
import { ICustomAttribute } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {};

const defaultFormValues: Partial<ICustomAttribute> = {
  display_name: "",
  extra_settings: {
    file_formats: [],
  },
  is_multi: false,
  is_required: false,
};

export const FileAttributeForm: React.FC<Props> = () => {
  const { control } = useForm({ defaultValues: defaultFormValues });

  const typeMetaData = CUSTOM_ATTRIBUTES_LIST.files;

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
          <Disclosure.Panel className="p-3 pl-9 pt-0">
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
                name="extra_settings.file_formats"
                render={({ field: { onChange, value } }) => (
                  <FileFormatsDropdown value={value} onChange={onChange} />
                )}
              />
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
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
