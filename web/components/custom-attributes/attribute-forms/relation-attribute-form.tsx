import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Disclosure } from "@headlessui/react";

// components
import { Input } from "components/custom-attributes";
// ui
import { CustomSelect, PrimaryButton, SecondaryButton, ToggleSwitch } from "components/ui";
// icons
import { ChevronDown } from "lucide-react";
// types
import { ICustomAttribute } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST, CUSTOM_ATTRIBUTE_UNITS } from "constants/custom-attributes";

type Props = {
  attributeDetails: ICustomAttribute;
  handleDeleteAttribute: () => Promise<void>;
  handleUpdateAttribute: (data: Partial<ICustomAttribute>) => Promise<void>;
};

const typeMetaData = CUSTOM_ATTRIBUTES_LIST.relation;

export const RelationAttributeForm: React.FC<Props> = (props) => {
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
                  name="unit"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      label={<span className="capitalize text-xs">{value}</span>}
                      value={value}
                      onChange={onChange}
                      buttonClassName="bg-custom-background-100 !px-3 !py-2 !border-custom-border-200 !rounded"
                      optionsClassName="w-full"
                      input
                    >
                      {CUSTOM_ATTRIBUTE_UNITS.map((unit) => (
                        <CustomSelect.Option key={unit.value} value={unit.value}>
                          {unit.label}
                        </CustomSelect.Option>
                      ))}
                    </CustomSelect>
                  )}
                />
                {/* <div>
      <p className="text-xs">Selection type</p>
      <div className="mt-2 flex items-center gap-6 accent-custom-primary-100">
        <div className="flex items-center gap-1 text-xs">
          <input
            type="radio"
            name="is_multi"
            value="false"
            id="singleSelect"
            className="scale-75"
            defaultChecked
          />
          <label htmlFor="singleSelect">Single Select</label>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <input type="radio" name="is_multi" value="true" id="multiSelect" className="scale-75" />
          <label htmlFor="multiSelect">Multi select</label>
        </div>
      </div>
    </div> */}
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
