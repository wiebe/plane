import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import { usePopper } from "react-popper";

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
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
  });

  return (
    <Menu as="div" className="flex-shrink-0 text-left">
      <Menu.Button as={React.Fragment}>
        <button
          type="button"
          ref={setReferenceElement}
          className="flex items-center gap-1 text-xs font-medium text-custom-primary-100"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add Attribute
        </button>
      </Menu.Button>
      <Menu.Items>
        <div
          ref={setPopperElement}
          className="fixed z-10 border-[0.5px] border-custom-border-300 p-1 min-w-[10rem] max-h-60 rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none overflow-y-auto"
          style={styles.popper}
          {...attributes.popper}
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
        </div>
      </Menu.Items>
    </Menu>
  );
};
