// types
import { Props } from "./types";

export const CustomFileAttribute: React.FC<Props & { value: any | null }> = ({
  attributeDetails,
  onChange,
  value,
}) => (
  <div className="flex-shrink-0">
    <button
      type="button"
      className="flex items-center gap-2 px-2.5 py-0.5 bg-custom-background-80 rounded text-xs"
    >
      Upload file
    </button>
  </div>
);
