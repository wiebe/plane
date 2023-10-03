import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// hooks
import useOutsideClickDetector from "hooks/use-outside-click-detector";
// types
import { ICustomAttribute } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  value: string | undefined;
  onChange: (val: string) => void;
};

export const CustomTextAttribute: React.FC<Props & { value: string | undefined }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef(null);

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

  useOutsideClickDetector(formRef, () => {
    setIsEditing(false);
  });

  return (
    <div className="flex-shrink-0">
      {!isEditing && (
        <div
          className="cursor-pointer text-xs truncate bg-custom-background-80 px-2.5 py-0.5 w-min max-w-full whitespace-nowrap rounded"
          onClick={() => setIsEditing(true)}
        >
          {value && value !== "" ? value : "Empty"}
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center" ref={formRef}>
          <Controller
            control={control}
            name="text"
            render={({ field }) => (
              <input
                type="text"
                className="text-xs px-2 py-0.5 bg-custom-background-80 rounded w-full outline-none"
                required={attributeDetails.is_required}
                placeholder={attributeDetails.display_name}
                {...field}
              />
            )}
          />
        </form>
      )}
    </div>
  );
};
