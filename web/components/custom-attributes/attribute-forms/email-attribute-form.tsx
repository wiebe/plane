// react-hook-form
import { Controller } from "react-hook-form";
// ui
import { FormComponentProps, Input } from "components/custom-attributes";

export const EmailAttributeForm: React.FC<FormComponentProps> = ({ control }) => (
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
      name="default_value"
      render={({ field: { onChange, value } }) => (
        <Input
          type="email"
          placeholder="Enter default email"
          value={value?.toString()}
          onChange={onChange}
        />
      )}
    />
  </div>
);
