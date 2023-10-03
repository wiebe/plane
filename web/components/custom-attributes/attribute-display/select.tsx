import React, { useState } from "react";
import { usePopper } from "react-popper";
import { Combobox } from "@headlessui/react";

// icons
import { Check, Search, XIcon } from "lucide-react";
// types
import { ICustomAttribute } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  className?: string;
  onChange: (val: string | string[] | undefined) => void;
} & (
  | {
      multiple?: false;
      value: string | undefined;
    }
  | { multiple?: true; value: string[] | undefined }
);

export const CustomSelectAttribute: React.FC<Props> = (props) => {
  const { attributeDetails, className = "", multiple = false, onChange, value } = props;

  const [query, setQuery] = useState("");

  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
  });

  const options = attributeDetails.children.filter((option) =>
    option.display_name.toLowerCase().includes(query.toLowerCase())
  );

  const comboboxProps: any = {
    onChange,
    value,
  };

  if (multiple) comboboxProps.multiple = true;

  return (
    <Combobox as="div" className="flex-shrink-0 text-left flex items-center" {...comboboxProps}>
      <Combobox.Button as={React.Fragment}>
        <button type="button" ref={setReferenceElement}>
          {value ? (
            Array.isArray(value) ? (
              value.length > 0 ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {value.map((val) => {
                    const optionDetails = options.find((o) => o.id === val);

                    return (
                      <div
                        key={val}
                        className="px-2.5 py-0.5 rounded text-xs flex items-center justify-between gap-1"
                        style={{
                          backgroundColor: `${optionDetails?.color}40`,
                        }}
                      >
                        {optionDetails?.display_name}
                        {((attributeDetails.is_required && value.length > 1) ||
                          !attributeDetails.is_required) && (
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              onChange(value.filter((v) => v !== val));
                            }}
                          >
                            <XIcon size={10} strokeWidth={1.5} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`text-xs px-2.5 py-0.5 rounded bg-custom-background-80 ${className}`}
                >
                  Select {attributeDetails.display_name}
                </div>
              )
            ) : (
              <div
                className="px-2.5 py-0.5 rounded text-xs flex items-center justify-between gap-1"
                style={{
                  backgroundColor: `${options.find((o) => o.id === value)?.color}40`,
                }}
              >
                {options.find((o) => o.id === value)?.display_name}
                {!attributeDetails.is_required && (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      onChange(undefined);
                    }}
                  >
                    <XIcon size={10} strokeWidth={1.5} />
                  </span>
                )}
              </div>
            )
          ) : (
            <div
              className={`cursor-pointer text-xs truncate bg-custom-background-80 px-2.5 py-0.5 rounded ${className}`}
            >
              Select {attributeDetails.display_name}
            </div>
          )}
        </button>
      </Combobox.Button>
      <Combobox.Options>
        <div
          className="fixed z-10 border border-custom-border-300 px-2 py-2.5 rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none w-48 whitespace-nowrap mt-1"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="flex w-full items-center justify-start rounded-sm border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 mb-1">
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
        </div>
      </Combobox.Options>
    </Combobox>
  );
};
