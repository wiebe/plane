import React from "react";

// headless ui
import { Popover, Transition } from "@headlessui/react";
// react-color
import { TwitterPicker } from "react-color";

type Props = {
  onChange: (hexValue: string) => void;
  selectedColor: string;
  size: number;
};

export const ColorPicker: React.FC<Props> = ({ onChange, selectedColor, size = 14 }) => (
  <Popover className="relative">
    {({ close }) => (
      <>
        <Popover.Button className="grid place-items-center h-3.5 w-3.5 rounded-sm focus:outline-none">
          <span
            className="h-full w-full rounded-sm"
            style={{ backgroundColor: selectedColor, height: `${size}px`, width: `${size}px` }}
          />
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
          <Popover.Panel className="absolute bottom-full left-0 z-10 mb-1 px-2 sm:px-0">
            <TwitterPicker
              color={selectedColor}
              onChange={(value) => {
                onChange(value.hex);
                close();
              }}
            />
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
);
