// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FormComponentProps, Input } from "components/custom-attributes";
// ui
import { CustomSelect, ToggleSwitch, Tooltip } from "components/ui";
// constants
import { DATE_FORMATS, TIME_FORMATS } from "constants/custom-attributes";

export const DateTimeAttributeForm: React.FC<FormComponentProps> = ({ control, watch }) => (
  <div className="space-y-3">
    <Controller
      control={control}
      name="display_name"
      render={({ field: { onChange, value } }) => (
        <Input placeholder="Enter field title" value={value} onChange={onChange} />
      )}
    />
    <div>
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
        name="extra_settings.hide_date"
        render={({ field: { onChange, value } }) => (
          <div className="flex items-center justify-end gap-1 mt-2">
            <Tooltip
              tooltipContent="Cannot disable both, date and time"
              disabled={!watch("extra_settings.hide_time")}
            >
              <div className="flex items-center gap-1">
                <ToggleSwitch
                  value={value ?? false}
                  onChange={onChange}
                  size="sm"
                  disabled={watch("extra_settings.hide_time")}
                />
                <span className="text-xs">Don{"'"}t show date</span>
              </div>
            </Tooltip>
          </div>
        )}
      />
    </div>
    <div>
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
      <Controller
        control={control}
        name="extra_settings.hide_time"
        render={({ field: { onChange, value } }) => (
          <div className="flex items-center justify-end gap-1 mt-2">
            <Tooltip
              tooltipContent="Cannot disable both, date and time"
              disabled={!watch("extra_settings.hide_date")}
            >
              <div className="flex items-center gap-1">
                <ToggleSwitch
                  value={value ?? false}
                  onChange={onChange}
                  size="sm"
                  disabled={watch("extra_settings.hide_date")}
                />
                <span className="text-xs">Don{"'"}t show time</span>
              </div>
            </Tooltip>
          </div>
        )}
      />
    </div>
  </div>
);
