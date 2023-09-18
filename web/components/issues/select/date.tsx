import React from "react";

import { Popover, Transition } from "@headlessui/react";
import { CalendarDaysIcon, XMarkIcon } from "@heroicons/react/24/outline";
// react-datepicker
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { renderDateFormat, renderShortDateWithYearFormat } from "helpers/date-time.helper";

type Props = {
  label: string;
  maxDate?: Date;
  minDate?: Date;
  onChange: (val: string | null) => void;
  value: string | null;
};

export const IssueDateSelect: React.FC<Props> = ({ label, maxDate, minDate, onChange, value }) => (
  <Popover className="relative flex items-center justify-center  rounded-lg">
    {({ close }) => (
      <>
        <Popover.Button className="flex items-center gap-1 rounded text-xs bg-custom-background-80 px-2.5 py-0.5">
          {value ? (
            <>
              <span className="text-custom-text-100">{renderShortDateWithYearFormat(value)}</span>
              <button onClick={() => onChange(null)}>
                <XMarkIcon className="h-3 w-3" />
              </button>
            </>
          ) : (
            <>
              <CalendarDaysIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{label}</span>
            </>
          )}
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
          <Popover.Panel className="absolute top-10 -left-10 z-20  transform overflow-hidden">
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={(val) => {
                if (!val) onChange("");
                else onChange(renderDateFormat(val));

                close();
              }}
              dateFormat="dd-MM-yyyy"
              minDate={minDate}
              maxDate={maxDate}
              inline
            />
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
);
