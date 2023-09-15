import { useEffect, useState } from "react";

// react-hook-form
import { Controller, useForm } from "react-hook-form";
// ui
import { ProgressBar } from "components/ui";
// types
import { Props } from "./types";

export const CustomNumberAttribute: React.FC<Props & { value: number | undefined }> = ({
  attributeDetails,
  onChange,
  value,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, reset, setFocus } = useForm({ defaultValues: { number: "" } });

  const handleFormSubmit = (data: { number: string }) => {
    setIsEditing(false);

    onChange(data.number);
  };

  useEffect(() => {
    if (isEditing) {
      setFocus("number");
    }
  }, [isEditing, setFocus]);

  useEffect(() => {
    reset({ number: value?.toString() });
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

  const extraSettings = attributeDetails.extra_settings;

  return (
    <div className="flex-shrink-0">
      {!isEditing && (
        <div className="cursor-pointer text-xs" onClick={() => setIsEditing(true)}>
          {value ? (
            <>
              {extraSettings?.representation === "bar" ? (
                <div className="flex items-center gap-2 w-full">
                  {extraSettings?.show_number && (
                    <span className="flex-shrink-0 font-medium">{value}</span>
                  )}
                  <div className="relative h-1.5 bg-custom-background-80 flex-grow w-full rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full"
                      style={{
                        backgroundColor: attributeDetails.color ?? "rgb(var(--color-primary-100))",
                        width: `${(value / parseInt(extraSettings.divided_by ?? 100, 10)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ) : extraSettings?.representation === "ring" ? (
                <div className="flex items-center gap-2 w-full">
                  {extraSettings?.show_number && (
                    <span className="flex-shrink-0 font-medium">{value}</span>
                  )}
                  <ProgressBar
                    activeStrokeColor={attributeDetails.color ?? "rgb(var(--color-primary-100))"}
                    value={value}
                    maxValue={parseInt(extraSettings.divided_by ?? 100, 10)}
                  />
                </div>
              ) : (
                <span className="font-medium">{value}</span>
              )}
            </>
          ) : (
            "Empty"
          )}
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center">
          <Controller
            control={control}
            name="number"
            render={({ field }) => (
              <input
                type="number"
                className="hide-arrows text-xs px-2 py-0.5 bg-custom-background-80 rounded w-full outline-none"
                step={1}
                min={extraSettings.divided_by ? 0 : undefined}
                max={extraSettings.divided_by ?? undefined}
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
