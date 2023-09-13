import React from "react";

// react-hook-form
import { Controller } from "react-hook-form";
// react-color
import { TwitterPicker } from "react-color";
// headless ui
import { Popover, Transition } from "@headlessui/react";
// components
import { FormComponentProps, Input } from "components/custom-attributes";
// icons
import { MoreHorizontal } from "lucide-react";

export const SelectOption: React.FC = () => (
  <div className="group w-3/5 flex items-center justify-between gap-1 hover:bg-custom-background-80 px-2 py-1 rounded">
    <div className="flex items-center gap-1 flex-grow truncate">
      {/* <button type="button">
        <GripVertical className="text-custom-text-400" size={14} />
      </button> */}
      <p className="bg-custom-primary-500/10 text-custom-text-300 text-xs p-1 rounded inline truncate">
        🚀 Option 1
      </p>
    </div>
    <div className="flex-shrink-0 flex items-center gap-2">
      <button
        type="button"
        className="hidden group-hover:inline-block text-custom-text-300 text-xs"
      >
        Set as default
      </button>
      <button type="button">
        <MoreHorizontal className="text-custom-text-400" size={14} />
      </button>
    </div>
  </div>
);

export const SelectAttributeForm: React.FC<FormComponentProps & { multiple?: boolean }> = ({
  control,
  multiple = false,
}) => (
  <div className="space-y-3">
    <Controller
      control={control}
      name="display_name"
      render={({ field: { onChange, value } }) => (
        <Input placeholder="Enter field title" value={value} onChange={onChange} />
      )}
    />
    <div>
      <p className="text-xs">Options</p>
      <div className="mt-3 space-y-2">
        {/* TODO: map over options */}
        <SelectOption />
        <SelectOption />
        <SelectOption />
      </div>
      <div className="mt-2 w-3/5">
        <div className="bg-custom-background-100 rounded border border-custom-border-200 flex items-center gap-2 px-3 py-2">
          <span className="flex-shrink-0 text-xs grid place-items-center">🚀</span>
          <input
            type="text"
            className="flex-grow border-none outline-none placeholder:text-custom-text-400 text-xs"
            placeholder="Enter new option"
          />
          <Popover className="relative">
            {({ open, close }) => (
              <>
                <Popover.Button className="grid place-items-center h-3.5 w-3.5 rounded-sm focus:outline-none">
                  <span className="h-full w-full rounded-sm bg-black" />
                </Popover.Button>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute bottom-full right-0 z-10 mb-1 px-2 sm:px-0">
                    <Controller
                      name="color"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <TwitterPicker
                          color={"#ff0000"}
                          onChange={(value) => {
                            onChange(value.hex);
                            close();
                          }}
                        />
                      )}
                    />
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
    </div>
  </div>
);
