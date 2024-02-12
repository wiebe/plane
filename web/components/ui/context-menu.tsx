import { Fragment, useState } from "react";
import { Menu } from "@headlessui/react";
import { usePopper } from "react-popper";
// helpers
import { cn } from "helpers/common.helper";

type Props = {
  children: React.ReactNode;
  maxHeight?: "sm" | "rg" | "md" | "lg";
  options: {
    key: string;
    label: string;
  }[];
  optionsClassName?: string;
  optionItemClassName?: string;
};

export const CustomContextMenu: React.FC<Props> = (props) => {
  const { children, maxHeight, options, optionsClassName, optionItemClassName } = props;
  // states
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  // react-popper
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
  });

  return (
    <Menu as="div">
      <Menu.Button as={Fragment} ref={setReferenceElement}>
        {children}
      </Menu.Button>
      <Menu.Items className="fixed z-10" static>
        <div
          className={cn(
            "my-1 overflow-y-scroll rounded-md border-[0.5px] border-custom-border-300 bg-custom-background-100 px-2 py-2.5 text-xs shadow-custom-shadow-rg focus:outline-none min-w-[12rem] whitespace-nowrap",
            {
              "max-h-60": maxHeight === "lg",
              "max-h-48": maxHeight === "md",
              "max-h-36": maxHeight === "rg",
              "max-h-28": maxHeight === "sm",
            },
            optionsClassName
          )}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {options.map((option) => (
            <Menu.Item
              as="button"
              key={option.key}
              className={({ active }) =>
                cn(
                  "w-full select-none truncate rounded px-1 py-1.5 text-left text-custom-text-200",
                  {
                    "bg-custom-background-80": active,
                  },
                  optionItemClassName
                )
              }
            >
              {option.label}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};
