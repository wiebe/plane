import { useState } from "react";

// types
import { Props } from "./types";
import { renderDateFormat } from "helpers/date-time.helper";

export const CustomDateTimeAttribute: React.FC<Props & { value: Date | undefined }> = ({
  onChange,
  value,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateDateTime = (val: string) => {
    setIsEditing(false);

    onChange(new Date(val));
  };

  return (
    <div className="flex-shrink-0">
      {!isEditing &&
        (value ? (
          <div
            className="cursor-pointer text-xs px-2 py-0.5 bg-custom-background-80 rounded w-min max-w-full whitespace-nowrap outline-none"
            onClick={() => setIsEditing(true)}
          >
            {renderDateFormat(value)}
          </div>
        ) : (
          <div className="cursor-pointer text-xs truncate" onClick={() => setIsEditing(true)}>
            Empty
          </div>
        ))}
      {isEditing && (
        <input
          type="datetime-local"
          className="text-xs px-2 py-0.5 bg-custom-background-80 rounded w-full outline-none"
          defaultValue={value?.toString()}
          onBlur={(e) => handleUpdateDateTime(e.target.value)}
        />
      )}
    </div>
  );
};
