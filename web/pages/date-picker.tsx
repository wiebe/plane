import { Combobox } from "@headlessui/react";
import { addDays } from "date-fns";
import { enIN } from "date-fns/locale";
import { useState } from "react";
import { Calendar, DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file

const DatePicker = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);
  const [date, setDate] = useState(new Date());

  return (
    <Combobox>
      <Combobox.Button className="rounded-sm bg-custom-background-80 px-2 py-1.5 focus:ring-2">
        Datepicker
      </Combobox.Button>
      <Combobox.Options>
        <Calendar date={date} onChange={(newDate) => setDate(newDate)} locale={enIN} />
        {/* <DateRangePicker
          onChange={(item) => {
            console.log("item", item);
            setState([item.selection]);
          }}
          moveRangeOnFirstSelection={false}
          months={1}
          ranges={state}
          direction="horizontal"
          locale={enIN}
          editableDateInputs
          startDatePlaceholder="Start date"
          endDatePlaceholder="End date"
        /> */}
      </Combobox.Options>
    </Combobox>
  );
};

export default DatePicker;
