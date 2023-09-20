import React, { useRef, useState } from "react";

// headless ui
import { Menu } from "@headlessui/react";
// hooks
import useDynamicDropdownPosition from "hooks/use-dynamic-dropdown";
// icons
import { Plus } from "lucide-react";
// types
import { TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  onClick: (type: TCustomAttributeTypes) => void;
};

export const TypesDropdown: React.FC<Props> = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useDynamicDropdownPosition(isOpen, () => setIsOpen(false), buttonRef, optionsRef);

  return (
    <Menu as="div" className="flex-shrink-0 text-left">
      {({ open }: { open: boolean }) => {
        if (open) {
          if (!isOpen) setIsOpen(true);
        } else if (isOpen) setIsOpen(false);

        return (
          <>
            <Menu.Button
              ref={buttonRef}
              className="flex items-center gap-1 text-xs font-medium text-custom-primary-100"
            >
              <Plus size={14} strokeWidth={1.5} />
              Add Attribute
            </Menu.Button>
            <div className={`${open ? "fixed z-20 top-0 left-0 h-full w-full cursor-auto" : ""}`}>
              <Menu.Items
                ref={optionsRef}
                className="fixed z-10 border-[0.5px] border-custom-border-300 p-1 min-w-[10rem] max-h-60 rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none overflow-y-auto"
              >
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
            </div>
          </>
        );
      }}
    </Menu>
  );
};
