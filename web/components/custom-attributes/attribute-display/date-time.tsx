// react-datepicker
import ReactDatePicker from "react-datepicker";
// types
import { ICustomAttribute } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  className?: string;
  issueId: string;
  projectId: string;
  value: Date | undefined;
  onChange: (val: Date | null) => void;
};

const DATE_FORMATS: { [key: string]: string } = {
  "MM-DD-YYYY": "MM-dd-yyyy",
  "DD-MM-YYYY": "dd-MM-yyyy",
  "YYYY-MM-DD": "yyyy-MM-dd",
};

const TIME_FORMATS: { [key: string]: string } = {
  "12": "hh:mm aa",
  "24": "HH:mm",
};

export const CustomDateTimeAttribute: React.FC<Props> = (props) => {
  const { attributeDetails, className = "", onChange, value } = props;

  return (
    <div className="flex-shrink-0">
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        className={`bg-custom-background-80 rounded text-xs px-2.5 py-0.5 outline-none truncate ${className}`}
        calendarClassName="!bg-custom-background-80"
        dateFormat={`${
          attributeDetails.extra_settings.hide_date
            ? ""
            : DATE_FORMATS[attributeDetails.extra_settings.date_format] ?? "dd-MM-yyyy"
        } ${
          attributeDetails.extra_settings.hide_time
            ? ""
            : TIME_FORMATS[attributeDetails.extra_settings.time_format] ?? "HH:mm"
        }`}
        showTimeInput={!attributeDetails.extra_settings.hide_time}
        isClearable={!attributeDetails.is_required}
        placeholderText={`Select ${attributeDetails.display_name}`}
      />
    </div>
  );
};
