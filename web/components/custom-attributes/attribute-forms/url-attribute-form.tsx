// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FormComponentProps, Input } from "components/custom-attributes";

export const UrlAttributeForm: React.FC<FormComponentProps> = ({ control }) => (
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
        <Input type="url" placeholder="Enter default URL" value={value ?? ""} onChange={onChange} />
      )}
    />
  </div>
);
