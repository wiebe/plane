import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { ColorPicker } from "components/custom-attributes";
// ui
import { PrimaryButton } from "components/ui";
// helpers
import { getRandomColor } from "helpers/color.helper";
// types
import { ICustomAttribute } from "types";

type Props = {
  data: ICustomAttribute | null;
  objectId: string;
  onSubmit?: () => void;
  parentId: string;
};

export const OptionForm: React.FC<Props> = observer((props) => {
  const { data, objectId, onSubmit, parentId } = props;

  const [option, setOption] = useState<Partial<ICustomAttribute>>({
    display_name: "",
    color: getRandomColor(),
  });
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes } = useMobxStore();

  const handleCreateOption = async () => {
    if (!workspaceSlug) return;

    if (option.display_name === "") return;

    const payload: Partial<ICustomAttribute> = {
      color: option.color,
      display_name: option.display_name,
      type: "option",
    };

    await customAttributes.createAttributeOption(workspaceSlug.toString(), objectId, {
      ...payload,
      parent: parentId,
    });
  };

  const handleUpdateOption = async () => {
    if (!workspaceSlug) return;

    if (option.display_name === "" || !option.parent || !option.id) return;

    setIsEditing(true);

    const payload: Partial<ICustomAttribute> = {
      color: option.color,
      display_name: option.display_name,
    };

    await customAttributes
      .updateAttributeOption(workspaceSlug.toString(), objectId, option.parent, option.id, payload)
      .finally(() => setIsEditing(false));
  };

  const handleFormSubmit = async () => {
    if (data) await handleUpdateOption();
    else await handleCreateOption();

    setOption({
      display_name: "",
      color: getRandomColor(),
    });

    if (onSubmit) onSubmit();
  };

  useEffect(() => {
    if (!data) return;

    setOption({ ...data });
  }, [data]);

  return (
    <div className="flex items-center gap-2">
      <div className="bg-custom-background-100 rounded border border-custom-border-200 flex items-center gap-2 px-3 py-2 flex-grow">
        <input
          type="text"
          className="flex-grow border-none outline-none placeholder:text-custom-text-400 text-xs bg-transparent"
          value={option.display_name}
          onChange={(e) => setOption((prev) => ({ ...prev, display_name: e.target.value }))}
          placeholder="Enter new option"
        />
        <ColorPicker
          onChange={(val) => setOption((prev) => ({ ...prev, color: val }))}
          selectedColor={option.color ?? getRandomColor()}
        />
      </div>
      <div className="flex-shrink-0">
        {data ? (
          <PrimaryButton
            onClick={handleFormSubmit}
            size="sm"
            className="!py-1.5 !px-2"
            loading={isEditing}
          >
            {isEditing ? "Updating..." : "Update"}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={handleFormSubmit}
            size="sm"
            className="!py-1.5 !px-2"
            loading={customAttributes.createAttributeOptionLoader}
          >
            {customAttributes.createAttributeOptionLoader ? "Adding..." : "Add"}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
});
