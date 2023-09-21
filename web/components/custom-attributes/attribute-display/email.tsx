import { useEffect, useState } from "react";

// react-hook-form
import { Controller, useForm } from "react-hook-form";
// types
import { ICustomAttribute } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  issueId: string;
  projectId: string;
  value: string | undefined;
  onChange: (val: string) => void;
};

export const CustomEmailAttribute: React.FC<Props> = ({ attributeDetails, onChange, value }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, reset, setFocus } = useForm({ defaultValues: { email: "" } });

  const handleFormSubmit = (data: { email: string }) => {
    setIsEditing(false);

    onChange(data.email);
  };

  useEffect(() => {
    if (isEditing) setFocus("email");
  }, [isEditing, setFocus]);

  useEffect(() => {
    reset({ email: value?.toString() });
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
          className="cursor-pointer text-xs truncate bg-custom-background-80 px-2.5 py-0.5 w-min max-w-full whitespace-nowrap rounded"
          onClick={() => setIsEditing(true)}
        >
          {value && value !== "" ? (
            <a href={`mailto:${value}`} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          ) : (
            "Empty"
          )}
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <input
                type="email"
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
