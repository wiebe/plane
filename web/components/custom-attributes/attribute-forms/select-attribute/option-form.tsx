import React, { useState } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// headless ui
import { Popover, Transition } from "@headlessui/react";
// react-color
import { TwitterPicker } from "react-color";
// ui
import { PrimaryButton } from "components/ui";
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
        <Popover className="relative">
          {({ close }) => (
            <>
              <Popover.Button className="grid place-items-center h-3.5 w-3.5 rounded-sm focus:outline-none">
                <span
                  className="h-full w-full rounded-sm"
                  style={{ backgroundColor: optionColor }}
                />
              </Popover.Button>

              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute bottom-full right-0 z-10 mb-1 px-2 sm:px-0">
                  <TwitterPicker
                    color={optionColor}
                    onChange={(value) => {
                      setOptionColor(value.hex);
                      close();
                    }}
                  />
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
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
