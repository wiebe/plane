import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { Controller, useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import useSWR from "swr";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { Input, TypesDropdown, AttributeForm } from "components/custom-attributes";
import EmojiIconPicker from "components/emoji-icon-picker";
// ui
import { Loader, PrimaryButton, SecondaryButton } from "components/ui";
// helpers
import { renderEmoji } from "helpers/emoji.helper";
// types
import { ICustomAttribute, TCustomAttributeTypes } from "types";
// fetch-keys
import { CUSTOM_ATTRIBUTE_DETAILS } from "constants/fetch-keys";
// constants
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  data?: ICustomAttribute;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<void>;
};

const defaultValues: Partial<ICustomAttribute> = {
  display_name: "",
  description: "",
  icon: "",
};

export const ObjectModal: React.FC<Props> = observer((props) => {
  const { data, isOpen, onClose, onSubmit } = props;

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<ICustomAttribute>({ defaultValues });

  const objectId = watch("id") && watch("id") !== "" ? watch("id") : null;

  const { customAttributes: customAttributesStore } = useMobxStore();

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      reset({ ...defaultValues });
    }, 300);
  };

  const handleCreateObject = async (formData: Partial<ICustomAttribute>) => {
    if (!workspaceSlug || !projectId) return;

    const payload: Partial<ICustomAttribute> = {
      description: formData.description ?? "",
      display_name: formData.display_name ?? "",
      icon: formData.icon ?? "",
      project: projectId.toString(),
      type: "entity",
    };

    await customAttributesStore
      .createObject(workspaceSlug.toString(), payload)
      .then((res) => setValue("id", res?.id ?? ""));
  };

  const handleUpdateObject = async (formData: Partial<ICustomAttribute>) => {
    if (!workspaceSlug || !data || !data.id) return;

    const payload: Partial<ICustomAttribute> = {
      description: formData.description ?? "",
      display_name: formData.display_name ?? "",
      icon: formData.icon ?? "",
    };

    await customAttributesStore.updateObject(workspaceSlug.toString(), data.id, payload);
  };

  const handleObjectFormSubmit = async (formData: Partial<ICustomAttribute>) => {
    if (data) await handleUpdateObject(formData);
    else await handleCreateObject(formData);

    if (onSubmit) onSubmit();
  };

  const handleCreateObjectAttribute = async (type: TCustomAttributeTypes) => {
    if (!workspaceSlug || !objectId) return;

    const typeMetaData = CUSTOM_ATTRIBUTES_LIST[type];

    const payload: Partial<ICustomAttribute> = {
      display_name: typeMetaData.label,
      type,
      ...typeMetaData.initialPayload,
    };

    await customAttributesStore.createObjectAttribute(workspaceSlug.toString(), {
      ...payload,
      parent: objectId,
    });
  };

  useSWR(
    workspaceSlug && objectId ? CUSTOM_ATTRIBUTE_DETAILS(objectId.toString()) : null,
    workspaceSlug && objectId
      ? () =>
          customAttributesStore.fetchObjectDetails(workspaceSlug.toString(), objectId.toString())
      : null
  );

  // update the form if data is present
  useEffect(() => {
    if (!data) return;

    reset({
      ...defaultValues,
      ...data,
    });
  }, [data, reset]);

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-custom-backdrop bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <Dialog.Panel className="fixed inset-0 h-full w-full z-20">
            <div className="flex items-center justify-center h-full w-full p-4 sm:p-0 scale-90">
              <div className="bg-custom-background-100 w-1/2 max-h-[85%] flex flex-col rounded-xl">
                <h3 className="text-2xl font-semibold px-6 pt-5">New Object</h3>
                <div className="mt-5 space-y-5 h-full overflow-y-auto">
                  <form
                    onSubmit={handleSubmit(handleObjectFormSubmit)}
                    className="space-y-4 px-6 pb-5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 bg-custom-background-80 grid place-items-center rounded">
                        <Controller
                          control={control}
                          name="icon"
                          render={({ field: { onChange, value } }) => (
                            <EmojiIconPicker
                              label={value ? renderEmoji(value) : "Icon"}
                              onChange={(icon) => {
                                if (typeof icon === "string") onChange(icon);
                              }}
                              value={value}
                              showIconPicker={false}
                            />
                          )}
                        />
                      </div>
                      <Controller
                        control={control}
                        name="display_name"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Enter Object Title"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field: { onChange, value } }) => (
                        <textarea
                          name="objectDescription"
                          id="objectDescription"
                          className="placeholder:text-custom-text-400 text-xs px-3 py-2 rounded bg-custom-background-100 border border-custom-border-200 w-full focus:outline-none"
                          cols={30}
                          rows={5}
                          placeholder="Enter Object Description"
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                        />
                      )}
                    />
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex items-center gap-3">
                        {!objectId && (
                          <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
                        )}
                        <PrimaryButton type="submit" loading={isSubmitting}>
                          {objectId
                            ? isSubmitting
                              ? "Saving..."
                              : "Save changes"
                            : isSubmitting
                            ? "Creating..."
                            : "Create Object"}
                        </PrimaryButton>
                      </div>
                    </div>
                  </form>
                  {objectId && (
                    <>
                      <div className="px-6">
                        <h4 className="font-medium">Attributes</h4>
                        <div className="mt-2 space-y-2">
                          {customAttributesStore.fetchObjectDetailsLoader ? (
                            <Loader>
                              <Loader.Item height="40px" />
                            </Loader>
                          ) : (
                            Object.keys(
                              customAttributesStore.objectAttributes[objectId] ?? {}
                            )?.map((attributeId) => {
                              const attribute =
                                customAttributesStore.objectAttributes[objectId][attributeId];

                              return (
                                <AttributeForm
                                  key={attributeId}
                                  attributeDetails={attribute}
                                  objectId={objectId}
                                  type={attribute.type}
                                />
                              );
                            })
                          )}
                          {customAttributesStore.createObjectAttributeLoader && (
                            <Loader>
                              <Loader.Item height="40px" />
                            </Loader>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 px-6 py-5 border-t border-custom-border-200">
                        <div className="flex-shrink-0">
                          <TypesDropdown onClick={handleCreateObjectAttribute} />
                        </div>
                        <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
});
