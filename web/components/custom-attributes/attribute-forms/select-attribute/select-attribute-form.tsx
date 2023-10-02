import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Controller, useForm } from "react-hook-form";
import { Disclosure } from "@headlessui/react";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { Input, OptionForm, SelectOption } from "components/custom-attributes";
// ui
import { PrimaryButton, SecondaryButton, ToggleSwitch } from "components/ui";
// icons
import { ChevronDown } from "lucide-react";
// types
import { ICustomAttribute } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  attributeDetails: ICustomAttribute;
  handleDeleteAttribute: () => Promise<void>;
  handleUpdateAttribute: (data: Partial<ICustomAttribute>) => Promise<void>;
};

const typeMetaData = CUSTOM_ATTRIBUTES_LIST.select;

export const SelectAttributeForm: React.FC<Props & { multiple?: boolean }> = observer((props) => {
  const {
    attributeDetails,
    handleDeleteAttribute,
    handleUpdateAttribute,
    multiple = false,
  } = props;

  const [optionToEdit, setOptionToEdit] = useState<ICustomAttribute | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const { customAttributes } = useMobxStore();

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues: typeMetaData.defaultFormValues });

  const options =
    customAttributes.objectAttributes?.[attributeDetails.parent ?? ""]?.[watch("id") ?? ""]
      ?.children;

  const handleDelete = async () => {
    setIsRemoving(true);

    await handleDeleteAttribute().finally(() => setIsRemoving(false));
  };

  useEffect(() => {
    if (!attributeDetails) return;

    reset({
      ...typeMetaData.defaultFormValues,
      ...attributeDetails,
    });
  }, [attributeDetails, reset]);

  return (
    <Disclosure
      as="div"
      className="bg-custom-background-90 border border-custom-border-200 rounded"
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="p-3 flex items-center justify-between gap-1 w-full">
            <div className="flex items-center gap-2.5">
              <typeMetaData.icon size={14} strokeWidth={1.5} />
              <h6 className="text-sm">{attributeDetails.display_name ?? typeMetaData.label}</h6>
            </div>
            <div className={`${open ? "-rotate-180" : ""} transition-all`}>
              <ChevronDown size={16} strokeWidth={1.5} rotate="180deg" />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel>
            <form onSubmit={handleSubmit(handleUpdateAttribute)} className="p-3 pl-9 pt-0">
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
                        objectId={attributeDetails.parent ?? ""}
                        option={option}
                      />
                    ))}
                  </div>
                  <div className="mt-2 w-3/5">
                    <OptionForm
                      data={optionToEdit}
                      objectId={attributeDetails.parent ?? ""}
                      onSubmit={() => setOptionToEdit(null)}
                      parentId={watch("id") ?? ""}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Controller
                    control={control}
                    name="is_required"
                    render={({ field: { onChange, value } }) => (
                      <ToggleSwitch value={value ?? false} onChange={onChange} />
                    )}
                  />
                  <span className="text-xs">Mandatory field</span>
                </div>
                <div className="flex items-center gap-2">
                  <SecondaryButton type="button" onClick={handleDelete} loading={isRemoving}>
                    {isRemoving ? "Removing..." : "Remove"}
                  </SecondaryButton>
                  <PrimaryButton type="submit" loading={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
});
