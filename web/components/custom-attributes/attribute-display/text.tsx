import { useEffect, useState } from "react";

// react-hook-form
import { Controller, useForm } from "react-hook-form";
// types
import { Props } from "./types";

export const CustomTextAttribute: React.FC<Props & { value: string | undefined }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, reset, setFocus } = useForm({ defaultValues: { text: "" } });

  const handleFormSubmit = (data: { text: string }) => {
    setIsEditing(false);

    onChange(data.text);
  };

  useEffect(() => {
    if (isEditing) {
      setFocus("text");
    }
  }, [isEditing, setFocus]);

  useEffect(() => {
    reset({ text: value ?? "" });
  }, [reset, value]);

  useEffect(() => {
    const handleEscKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
    };

    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, []);

  return (
    <div className="flex-shrink-0">
      {!isEditing && (
        <div
          className="cursor-pointer text-xs truncate bg-custom-background-80 px-2.5 py-0.5 rounded"
          onClick={() => setIsEditing(true)}
        >
          {value && value !== "" ? value : `Enter ${attributeDetails.display_name}`}
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center">
          <Controller
            control={control}
            name="text"
            render={({ field }) => (
              <input
                type="text"
                className="text-xs px-2 py-0.5 bg-custom-background-80 rounded w-full outline-none"
                required={attributeDetails.is_required}
                {...field}
              />
            )}
          />
        </form>
      )}
    </div>
  );
};
