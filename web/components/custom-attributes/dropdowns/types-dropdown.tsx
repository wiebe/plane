import React from "react";

// headless ui
import { Menu, Transition } from "@headlessui/react";
// icons
import { Plus } from "lucide-react";
// types
import { TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  onClick: (type: TCustomAttributeTypes) => void;
};

export const TypesDropdown: React.FC<Props> = ({ onClick }) => (
  <Menu as="div" className="relative flex-shrink-0 text-left">
    {({ open }: { open: boolean }) => (
      <>
        <Menu.Button className="flex items-center gap-1 text-xs font-medium text-custom-primary-100">
          <Plus size={14} strokeWidth={1.5} />
          Add Attribute
        </Menu.Button>
        <Transition
          show={open}
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Menu.Items className="fixed z-10 mb-2 border-[0.5px] border-custom-border-300 p-1 min-w-[10rem] max-h-60 rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none overflow-y-auto">
            {Object.keys(CUSTOM_ATTRIBUTES_LIST).map((type) => {
              const typeMetaData = CUSTOM_ATTRIBUTES_LIST[type as TCustomAttributeTypes];

              return (
                <Menu.Item
                  key={type}
                  as="button"
                  type="button"
                  onClick={() => onClick(type as TCustomAttributeTypes)}
                  className="flex items-center gap-1 cursor-pointer select-none truncate rounded px-1 py-1.5 hover:bg-custom-background-80 w-full"
                >
                  <typeMetaData.icon size={14} strokeWidth={1.5} />
                  {typeMetaData.label}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Transition>
      </>
    )}
  </Menu>
);
