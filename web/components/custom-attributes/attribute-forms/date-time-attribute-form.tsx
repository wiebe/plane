// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FormComponentProps, Input } from "components/custom-attributes";
// ui
import { CustomSelect } from "components/ui";
// constants
import { DATE_FORMATS, TIME_FORMATS } from "constants/custom-attributes";

export const DateTimeAttributeForm: React.FC<FormComponentProps> = ({ control }) => (
  <div className="space-y-3">
    <Controller
      control={control}
      name="display_name"
      render={({ field: { onChange, value } }) => (
        <Input placeholder="Enter field title" value={value} onChange={onChange} />
      )}
    />
    <Controller
      control={control}
      name="extra_settings.date_format"
      render={({ field: { onChange, value } }) => (
        <CustomSelect
          label={
            <span className="text-xs">{DATE_FORMATS.find((f) => f.value === value)?.label}</span>
          }
          value={value}
          onChange={onChange}
          buttonClassName="bg-custom-background-100 !px-3 !py-2 !border-custom-border-200 !rounded"
          optionsClassName="w-full"
          input
        >
          {DATE_FORMATS.map((format) => (
            <CustomSelect.Option key={format.value} value={format.value}>
              {format.label}
            </CustomSelect.Option>
          ))}
        </CustomSelect>
      )}
    />
    <Controller
      control={control}
      name="extra_settings.time_format"
      render={({ field: { onChange, value } }) => (
        <CustomSelect
          label={
            <span className="text-xs">{TIME_FORMATS.find((f) => f.value === value)?.label}</span>
          }
          value={value}
          onChange={onChange}
          buttonClassName="bg-custom-background-100 !px-3 !py-2 !border-custom-border-200 !rounded"
          optionsClassName="w-full"
          input
        >
          {TIME_FORMATS.map((format) => (
            <CustomSelect.Option key={format.value} value={format.value}>
              {format.label}
            </CustomSelect.Option>
          ))}
        </CustomSelect>
      )}
    />
  </div>
);
