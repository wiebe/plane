import React, { useState } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { ColorPicker } from "components/custom-attributes";
// ui
import { PrimaryButton } from "components/ui";
// types
import { ICustomAttribute } from "types";

type Props = {
  objectId: string;
  parentId: string;
};

export const OptionForm: React.FC<Props> = observer(({ objectId, parentId }) => {
  const [optionName, setOptionName] = useState("");
  const [optionColor, setOptionColor] = useState("#000000");

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes: customAttributesStore } = useMobxStore();
  const { createAttributeOption, createAttributeOptionLoader } = customAttributesStore;

  const handleCreateOption = async () => {
    if (!workspaceSlug) return;

    if (!optionName || optionName === "") return;

    const payload: Partial<ICustomAttribute> = {
      color: optionColor,
      display_name: optionName,
      type: "option",
    };

    await createAttributeOption(workspaceSlug.toString(), objectId, {
      ...payload,
      parent: parentId,
    }).then(() => {
      setOptionName("");
      setOptionColor("#000000");
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-custom-background-100 rounded border border-custom-border-200 flex items-center gap-2 px-3 py-2 flex-grow">
        {/* <span className="flex-shrink-0 text-xs grid place-items-center">🚀</span> */}
        <input
          type="text"
          className="flex-grow border-none outline-none placeholder:text-custom-text-400 text-xs"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          placeholder="Enter new option"
        />
        <ColorPicker onChange={(val) => setOptionColor(val)} selectedColor={optionColor} />
      </div>
      <div className="flex-shrink-0">
        <PrimaryButton
          onClick={handleCreateOption}
          size="sm"
          className="!py-1.5 !px-2"
          loading={createAttributeOptionLoader}
        >
          {createAttributeOptionLoader ? "Adding..." : "Add"}
        </PrimaryButton>
      </div>
    </div>
  );
});
