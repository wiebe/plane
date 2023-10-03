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

export const CustomUrlAttribute: React.FC<Props & { value: string | undefined }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef(null);

  const { control, handleSubmit, reset, setFocus } = useForm({ defaultValues: { url: "" } });

  const handleFormSubmit = (data: { url: string }) => {
    setIsEditing(false);

    onChange(data.url);
  };

  useEffect(() => {
    if (isEditing) setFocus("url");
  }, [isEditing, setFocus]);

  useEffect(() => {
    reset({ url: value?.toString() });
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
    <div className="flex-shrink-0 flex">
      {!isEditing && (
        <div
          className="cursor-pointer text-xs truncate bg-custom-background-80 px-2.5 py-0.5 rounded"
          onClick={() => setIsEditing(true)}
        >
          {value && value !== "" ? (
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          ) : (
            "Empty"
          )}
        </div>
      )}
      {isEditing && (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex items-center flex-grow"
          ref={formRef}
        >
          <Controller
            control={control}
            name="url"
            render={({ field }) => (
              <input
                type="url"
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
