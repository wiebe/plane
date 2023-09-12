import React from "react";

import { useRouter } from "next/router";

// headless ui
import { Listbox, Transition } from "@headlessui/react";
// icons
import { Plus } from "lucide-react";
// types
import { TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {};

export const TypesDropdown: React.FC<Props> = () => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  return (
    <Listbox as="div" className="relative flex-shrink-0 text-left">
      {({ open }: { open: boolean }) => (
        <>
          <Listbox.Button className="flex items-center gap-1 text-xs font-medium text-custom-primary-100">
            <Plus size={14} strokeWidth={1.5} />
            Add Attribute
          </Listbox.Button>
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
            <Listbox.Options className="absolute z-10 bottom-full mb-2 border-[0.5px] border-custom-border-300 p-1 min-w-[10rem] rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none">
              {Object.keys(CUSTOM_ATTRIBUTES_LIST).map((type) => {
                const typeMetaData = CUSTOM_ATTRIBUTES_LIST[type as TCustomAttributeTypes];

                return (
                  <Listbox.Option
                    key={type}
                    value={type}
                    className={({ active, selected }) =>
                      `flex items-center gap-1 cursor-pointer select-none truncate rounded px-1 py-1.5 ${
                        active || selected ? "bg-custom-background-80" : ""
                      } ${selected ? "text-custom-text-100" : "text-custom-text-200"}`
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <typeMetaData.icon size={14} strokeWidth={1.5} />
                        {typeMetaData.label}
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
};
