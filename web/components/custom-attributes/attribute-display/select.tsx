import React, { useRef, useState } from "react";

// headless ui
import { Combobox, Transition } from "@headlessui/react";
// hooks
import useOutsideClickDetector from "hooks/use-outside-click-detector";
// icons
import { Check, Search } from "lucide-react";
// types
import { Props } from "./types";

export const CustomSelectAttribute: React.FC<
  Props &
    (
      | { multiple?: false; value: string | undefined }
      | { multiple?: true; value: string[] | undefined }
    )
> = (props) => {
  const { attributeDetails, multiple = false, onChange, value } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownOptionsRef = useRef<HTMLUListElement>(null);

  const selectedOption =
    attributeDetails.children.find((option) => option.id === value) ??
    attributeDetails.children.find((option) => option.is_default);

  const options = attributeDetails.children.filter((option) =>
    option.display_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleOnOpen = () => {
    const dropdownButton = dropdownButtonRef.current;
    const dropdownOptions = dropdownOptionsRef.current;

    if (!dropdownButton || !dropdownOptions) return;

    const dropdownWidth = dropdownOptions.clientWidth;
    const dropdownHeight = dropdownOptions.clientHeight;

    const dropdownBtnX = dropdownButton.getBoundingClientRect().x;
    const dropdownBtnY = dropdownButton.getBoundingClientRect().y;
    const dropdownBtnHeight = dropdownButton.clientHeight;

    let top = dropdownBtnY + dropdownBtnHeight;
    if (dropdownBtnY + dropdownHeight > window.innerHeight)
      top = dropdownBtnY - dropdownHeight - 10;
    else top = top + 4;

    let left = dropdownBtnX;
    if (dropdownBtnX + dropdownWidth > window.innerWidth) left = dropdownBtnX - dropdownWidth;

    dropdownOptions.style.top = `${Math.round(top)}px`;
    dropdownOptions.style.left = `${Math.round(left)}px`;
  };

  useOutsideClickDetector(dropdownOptionsRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const comboboxProps: any = {
    value,
    onChange,
  };

  if (multiple) comboboxProps.multiple = true;

  return (
    <Combobox as="div" className="flex-shrink-0 text-left" {...comboboxProps}>
      {({ open }: { open: boolean }) => {
        if (open) handleOnOpen();

        return (
          <>
            <Combobox.Button
              ref={dropdownButtonRef}
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
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <div className="fixed z-10 top-0 left-0 h-full w-full cursor-auto">
                <Combobox.Options
                  ref={dropdownOptionsRef}
                  className="absolute z-10 border border-custom-border-300 px-2 py-2.5 rounded bg-custom-background-100 text-xs shadow-lg focus:outline-none w-48 whitespace-nowrap"
                >
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
                        className={({ active }) =>
                          `flex items-center justify-between gap-1 cursor-pointer select-none truncate rounded px-1 py-1.5 w-full ${
                            active ? "bg-custom-background-80" : ""
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className="px-1 rounded-sm truncate"
                              style={{ backgroundColor: `${option.color}40` }}
                            >
                              {option.display_name}
                            </span>
                            {selected && <Check size={14} strokeWidth={1.5} />}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                </Combobox.Options>
              </div>
            </Transition>
          </>
        );
      }}
    </Combobox>
  );
};
