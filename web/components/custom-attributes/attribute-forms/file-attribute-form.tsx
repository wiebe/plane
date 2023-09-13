// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FileFormatsDropdown, FormComponentProps, Input } from "components/custom-attributes";

export const FileAttributeForm: React.FC<FormComponentProps> = ({ control }) => (
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
      name="extra_settings.file_formats"
      render={({ field: { onChange, value } }) => (
        <FileFormatsDropdown value={value} onChange={onChange} />
      )}
    />
  </div>
);
