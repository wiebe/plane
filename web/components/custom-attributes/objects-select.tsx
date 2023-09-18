import { useEffect } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// ui
import { CustomSearchSelect } from "components/ui";

type Props = {
  onChange: (val: string | null) => void;
  projectId: string;
  value: string | null;
};

export const ObjectsSelect: React.FC<Props> = observer(({ onChange, projectId, value }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes: customAttributesStore } = useMobxStore();
  const { entities, fetchEntities } = customAttributesStore;

  const options:
    | {
        value: any;
        query: string;
        content: string;
      }[]
    | undefined = entities?.map((entity) => ({
    value: entity.id,
    query: entity.display_name,
    content: entity.display_name,
  }));
  options?.unshift({ value: null, query: "default", content: "Default" });

  useEffect(() => {
    if (!workspaceSlug) return;

    if (!entities) fetchEntities(workspaceSlug.toString(), projectId);
  }, [entities, fetchEntities, projectId, workspaceSlug]);

  return (
    <CustomSearchSelect
      customButton={
        <button type="button" className="bg-custom-background-80 rounded text-xs px-2.5 py-0.5">
          {entities?.find((e) => e.id === value)?.display_name ?? "Default"}
        </button>
      }
      value={value}
      maxHeight="md"
      optionsClassName="!min-w-[10rem]"
      onChange={onChange}
      options={options}
      position="right"
    />
  );
});
