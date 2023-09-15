import React, { useState } from "react";

// headless ui
import { Combobox, Transition } from "@headlessui/react";
// icons
import { Search } from "lucide-react";
// types
import { Props } from "./types";

export const CustomSelectAttribute: React.FC<Props & { value: string | undefined }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const [query, setQuery] = useState("");

  const selectedOption =
    attributeDetails.children.find((option) => option.id === value) ??
    attributeDetails.children.find((option) => option.is_default);

  const options = attributeDetails.children.filter((option) =>
    option.display_name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Combobox
      as="div"
      value={value}
      onChange={(val) => onChange(val)}
      className="relative flex-shrink-0 text-left"
    >
      {({ open }: { open: boolean }) => (
        <>
          <Combobox.Button
            className={`flex items-center text-xs rounded px-2.5 py-0.5 truncate w-min max-w-full text-left ${
              selectedOption ? "" : "bg-custom-background-80"
            }`}
            style={{
              backgroundColor: `${selectedOption?.color}40`,
            }}
          >
            {selectedOption?.display_name ?? "Select"}
          </Combobox.Button>
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
            <Combobox.Options className="fixed z-10 mb-2 border-[0.5px] border-custom-border-300 p-1 min-w-[10rem] max-h-60 max-w-[10rem] rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none mt-1 flex flex-col overflow-hidden">
              <div className="flex w-full items-center justify-start rounded-sm border-[0.6px] border-custom-border-200 bg-custom-background-90 px-2 mb-1">
                <Search className="text-custom-text-400" size={12} strokeWidth={1.5} />
                <Combobox.Input
                  className="w-full bg-transparent py-1 px-2 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search..."
                  displayValue={(assigned: any) => assigned?.name}
                />
              </div>
              <div className="mt-1 overflow-y-auto">
                {(options ?? []).map((option) => (
                  <Combobox.Option
                    key={option.id}
                    value={option.id}
                    className="flex items-center gap-1 cursor-pointer select-none truncate rounded px-1 py-1.5 hover:bg-custom-background-80 w-full"
                  >
                    <span
                      className="px-1 rounded-sm truncate"
                      style={{ backgroundColor: `${option.color}40` }}
                    >
                      {option.display_name}
                    </span>
                  </Combobox.Option>
                ))}
              </div>
            </Combobox.Options>
          </Transition>
        </>
      )}
    </Combobox>
  );
};
