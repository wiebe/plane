import React, { useState } from "react";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// react-hook-form
import { Controller } from "react-hook-form";
// components
import { FormComponentProps, Input, OptionForm, SelectOption } from "components/custom-attributes";
// types
import { ICustomAttribute } from "types";

export const SelectAttributeForm: React.FC<FormComponentProps & { multiple?: boolean }> = observer(
  ({ control, multiple = false, objectId = "", watch }) => {
    const [optionToEdit, setOptionToEdit] = useState<ICustomAttribute | null>(null);

    const { customAttributes: customAttributesStore } = useMobxStore();
    const { entityAttributes } = customAttributesStore;

    const options = entityAttributes?.[objectId]?.[watch("id") ?? ""]?.children;

    return (
      <div className="space-y-3">
        <Controller
          control={control}
          name="display_name"
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Enter field title" value={value} onChange={onChange} />
          )}
        />
        <div>
          <p className="text-xs">Options</p>
          <div className="mt-3 space-y-2 w-3/5">
            {options?.map((option) => (
              <SelectOption
                key={option.id}
                handleEditOption={() => setOptionToEdit(option)}
                objectId={objectId}
                option={option}
              />
            ))}
          </div>
          <div className="mt-2 w-3/5">
            <OptionForm
              data={optionToEdit}
              objectId={objectId}
              onSubmit={() => setOptionToEdit(null)}
              parentId={watch("id") ?? ""}
            />
          </div>
        </div>
      </div>
    );
  }
);
