import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// ui
import { Tooltip } from "components/ui";
// icons
import { MoreHorizontal } from "lucide-react";
// types
import { ICustomAttribute } from "types";

type Props = {
  objectId: string;
  option: ICustomAttribute;
};

export const SelectOption: React.FC<Props> = observer(({ objectId, option }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes: customAttributesStore } = useMobxStore();
  const { updateAttributeOption } = customAttributesStore;

  const handleSetAsDefault = async () => {
    if (!workspaceSlug || !option.parent) return;

    await updateAttributeOption(workspaceSlug.toString(), objectId, option.parent, option.id, {
      is_default: true,
    });
  };

  return (
    <div className="group flex items-center justify-between gap-1 hover:bg-custom-background-80 px-2 py-1 rounded">
      <div className="flex items-center gap-1 flex-grow truncate">
        {/* <button type="button">
        <GripVertical className="text-custom-text-400" size={14} />
      </button> */}
        <Tooltip tooltipContent={option.display_name}>
          <p
            className="text-custom-text-300 text-xs p-1 rounded inline truncate"
            style={{
              backgroundColor: `${option.color}40`,
            }}
          >
            {option.display_name}
          </p>
        </Tooltip>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {option.is_default ? (
          <span className="text-custom-text-300 text-xs">Default</span>
        ) : (
          <button
            type="button"
            onClick={handleSetAsDefault}
            className="hidden group-hover:inline-block text-custom-text-300 text-xs"
          >
            Set as default
          </button>
        )}
        <button type="button">
          <MoreHorizontal className="text-custom-text-400" size={14} />
        </button>
      </div>
    </div>
  );
});
