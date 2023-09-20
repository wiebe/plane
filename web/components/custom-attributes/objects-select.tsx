import { useEffect } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// ui
import { CustomSearchSelect } from "components/ui";
import { renderEmoji } from "helpers/emoji.helper";
import { TableProperties } from "lucide-react";

type Props = {
  onChange: (val: string | null) => void;
  projectId: string;
  value: string | null;
};

export const ObjectsSelect: React.FC<Props> = observer(({ onChange, projectId, value }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes } = useMobxStore();

  const options:
    | {
        value: any;
        query: string;
        content: JSX.Element;
      }[]
    | undefined = customAttributes.objects?.map((object) => ({
    value: object.id,
    query: object.display_name,
    content: (
      <div className="flex items-center gap-2 text-xs">
        {object.icon ? renderEmoji(object.icon) : <TableProperties size={14} strokeWidth={1.5} />}
        <span>{object.display_name}</span>
      </div>
    ),
  }));
  options?.unshift({
    value: null,
    query: "default",
    content: (
      <div className="flex items-center gap-2">
        <TableProperties size={14} strokeWidth={1.5} />
        <span>Default</span>
      </div>
    ),
  });

  useEffect(() => {
    if (!workspaceSlug) return;

    if (!customAttributes.objects)
      customAttributes.fetchObjects(workspaceSlug.toString(), projectId);
  }, [customAttributes, projectId, workspaceSlug]);

  const selectedObject = customAttributes.objects?.find((o) => o.id === value);

  return (
    <CustomSearchSelect
      label={
        <span className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs">
            {selectedObject?.icon ? (
              renderEmoji(selectedObject.icon)
            ) : (
              <TableProperties size={14} strokeWidth={1.5} />
            )}
            <span>{selectedObject?.display_name ?? "Default"}</span>
          </div>
        </span>
      }
      value={value}
      maxHeight="md"
      optionsClassName="!min-w-[10rem]"
      onChange={onChange}
      options={options}
      position="right"
      noChevron
    />
  );
});
