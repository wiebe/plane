import { useEffect, useState } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// headless ui
import { Disclosure } from "@headlessui/react";
// react-hook-form
import { Control, Controller, UseFormWatch, useForm } from "react-hook-form";
// components
import {
  CheckboxAttributeForm,
  DateTimeAttributeForm,
  EmailAttributeForm,
  FileAttributeForm,
  NumberAttributeForm,
  RelationAttributeForm,
  SelectAttributeForm,
  TextAttributeForm,
  UrlAttributeForm,
} from "components/custom-attributes";
// ui
import { PrimaryButton, SecondaryButton, ToggleSwitch } from "components/ui";
// icons
import { ChevronDown } from "lucide-react";
// types
import { ICustomAttribute, TCustomAttributeTypes } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  attributeDetails: Partial<ICustomAttribute>;
  objectId: string;
  type: TCustomAttributeTypes;
};

export type FormComponentProps = {
  control: Control<Partial<ICustomAttribute>, any>;
  objectId: string;
  watch: UseFormWatch<Partial<ICustomAttribute>>;
};

const RenderForm: React.FC<{ type: TCustomAttributeTypes } & FormComponentProps> = ({
  control,
  objectId,
  type,
  watch,
}) => {
  let FormToRender: any = <></>;

  if (type === "checkbox")
    FormToRender = <CheckboxAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "datetime")
    FormToRender = <DateTimeAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "email")
    FormToRender = <EmailAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "file")
    FormToRender = <FileAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "multi_select")
    FormToRender = (
      <SelectAttributeForm control={control} objectId={objectId} watch={watch} multiple />
    );
  else if (type === "number")
    FormToRender = <NumberAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "relation")
    FormToRender = <RelationAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "select")
    FormToRender = <SelectAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "text")
    FormToRender = <TextAttributeForm control={control} objectId={objectId} watch={watch} />;
  else if (type === "url")
    FormToRender = <UrlAttributeForm control={control} objectId={objectId} watch={watch} />;

  return FormToRender;
};

const OPTIONAL_FIELDS = ["checkbox", "file"];

export const AttributeForm: React.FC<Props> = observer(({ attributeDetails, objectId, type }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const typeMetaData = CUSTOM_ATTRIBUTES_LIST[type];

  const { customAttributes } = useMobxStore();

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues: typeMetaData.defaultFormValues });

  const handleUpdateAttribute = async (data: Partial<ICustomAttribute>) => {
    if (!workspaceSlug || !attributeDetails.id || !objectId) return;

    await customAttributes.updateObjectAttribute(
      workspaceSlug.toString(),
      objectId,
      attributeDetails.id,
      data
    );
  };

  const handleDeleteAttribute = async () => {
    if (!workspaceSlug || !attributeDetails.id || !objectId) return;

    setIsRemoving(true);

    await customAttributes
      .deleteObjectAttribute(workspaceSlug.toString(), objectId, attributeDetails.id)
      .finally(() => setIsRemoving(false));
  };

  useEffect(() => {
    if (!attributeDetails) return;

    reset({
      ...typeMetaData.defaultFormValues,
      ...attributeDetails,
    });
  }, [attributeDetails, reset, typeMetaData.defaultFormValues]);

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
              {attributeDetails.type && (
                <RenderForm
                  type={attributeDetails.type}
                  control={control}
                  objectId={objectId}
                  watch={watch}
                />
              )}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-shrink-0 flex items-center gap-2">
                  {!OPTIONAL_FIELDS.includes(attributeDetails.type ?? "") && (
                    <>
                      <Controller
                        control={control}
                        name="is_required"
                        render={({ field: { onChange, value } }) => (
                          <ToggleSwitch value={value ?? false} onChange={onChange} />
                        )}
                      />
                      <span className="text-xs">Mandatory field</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <SecondaryButton
                    type="button"
                    onClick={handleDeleteAttribute}
                    loading={isRemoving}
                  >
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
