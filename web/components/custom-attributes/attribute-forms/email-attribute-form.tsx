import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Disclosure } from "@headlessui/react";

// components
import { Input } from "components/custom-attributes";
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

const typeMetaData = CUSTOM_ATTRIBUTES_LIST.email;

export const EmailAttributeForm: React.FC<Props> = (props) => {
  const { attributeDetails, handleDeleteAttribute, handleUpdateAttribute } = props;

  const [isRemoving, setIsRemoving] = useState(false);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm({ defaultValues: typeMetaData.defaultFormValues });

  const handleDelete = async () => {
    setIsRemoving(true);

    await handleDeleteAttribute().finally(() => setIsRemoving(false));
  };

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
                <Controller
                  control={control}
                  name="default_value"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type="email"
                      placeholder="Enter default email"
                      value={value?.toString()}
                      onChange={onChange}
                    />
                  )}
                />
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
};
