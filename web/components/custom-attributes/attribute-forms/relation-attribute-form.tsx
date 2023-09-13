// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FormComponentProps, Input } from "components/custom-attributes";
// ui
import { CustomSelect } from "components/ui";
// constants
import { CUSTOM_ATTRIBUTE_UNITS } from "constants/custom-attributes";

export const RelationAttributeForm: React.FC<FormComponentProps> = ({ control }) => (
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
      name="unit"
      render={({ field: { onChange, value } }) => (
        <CustomSelect
          label={<span className="capitalize text-xs">{value}</span>}
          value={value}
          onChange={onChange}
          buttonClassName="bg-custom-background-100 !px-3 !py-2 !border-custom-border-200 !rounded"
          optionsClassName="w-full"
          input
        >
          {CUSTOM_ATTRIBUTE_UNITS.map((unit) => {
            if (unit.value === "user") return null;

            return (
              <CustomSelect.Option key={unit.value} value={unit.value}>
                {unit.label}
              </CustomSelect.Option>
            );
          })}
        </CustomSelect>
      )}
    />
    <div>
      <p className="text-xs">Selection type</p>
      <div className="mt-2 flex items-center gap-6 accent-custom-primary-100">
        <div className="flex items-center gap-1 text-xs">
          <input
            type="radio"
            name="is_multi"
            value="false"
            id="singleSelect"
            className="scale-75"
            defaultChecked
          />
          <label htmlFor="singleSelect">Single Select</label>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <input type="radio" name="is_multi" value="true" id="multiSelect" className="scale-75" />
          <label htmlFor="multiSelect">Multi select</label>
        </div>
      </div>
    </div>
  </div>
);
