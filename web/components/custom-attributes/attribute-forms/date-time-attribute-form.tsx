import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Disclosure } from "@headlessui/react";

// components
import { Input } from "components/custom-attributes";
// ui
import { CustomSelect, PrimaryButton, SecondaryButton, ToggleSwitch, Tooltip } from "components/ui";
// icons
import { ChevronDown } from "lucide-react";
// types
import { ICustomAttribute } from "types";
// constants
import { CUSTOM_ATTRIBUTES_LIST, DATE_FORMATS, TIME_FORMATS } from "constants/custom-attributes";

type Props = {
  attributeDetails: ICustomAttribute;
  handleDeleteAttribute: () => Promise<void>;
  handleUpdateAttribute: (data: Partial<ICustomAttribute>) => Promise<void>;
};

const typeMetaData = CUSTOM_ATTRIBUTES_LIST.datetime;

export const DateTimeAttributeForm: React.FC<Props> = (props) => {
  const { attributeDetails, handleDeleteAttribute, handleUpdateAttribute } = props;

  const [isRemoving, setIsRemoving] = useState(false);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    watch,
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
                <div>
                  <Controller
                    control={control}
                    name="extra_settings.date_format"
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        label={
                          <span className="text-xs">
                            {DATE_FORMATS.find((f) => f.value === value)?.label}
                          </span>
                        }
                        value={value}
                        onChange={onChange}
                        buttonClassName="bg-custom-background-100 !px-3 !py-2 !border-custom-border-200 !rounded"
                        optionsClassName="w-full"
                        input
                      >
                        {DATE_FORMATS.map((format) => (
                          <CustomSelect.Option key={format.value} value={format.value}>
                            {format.label}
                          </CustomSelect.Option>
                        ))}
                      </CustomSelect>
                    )}
                  />
                  <Controller
                    control={control}
                    name="extra_settings.hide_date"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <Tooltip
                          tooltipContent="Cannot disable both, date and time"
                          disabled={!watch("extra_settings.hide_time")}
                        >
                          <div className="flex items-center gap-1">
                            <ToggleSwitch
                              value={value ?? false}
                              onChange={onChange}
                              size="sm"
                              disabled={watch("extra_settings.hide_time")}
                            />
                            <span className="text-xs">Don{"'"}t show date</span>
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="extra_settings.time_format"
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        label={
                          <span className="text-xs">
                            {TIME_FORMATS.find((f) => f.value === value)?.label}
                          </span>
                        }
                        value={value}
                        onChange={onChange}
                        buttonClassName="bg-custom-background-100 !px-3 !py-2 !border-custom-border-200 !rounded"
                        optionsClassName="w-full"
                        input
                      >
                        {TIME_FORMATS.map((format) => (
                          <CustomSelect.Option key={format.value} value={format.value}>
                            {format.label}
                          </CustomSelect.Option>
                        ))}
                      </CustomSelect>
                    )}
                  />
                  <Controller
                    control={control}
                    name="extra_settings.hide_time"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <Tooltip
                          tooltipContent="Cannot disable both, date and time"
                          disabled={!watch("extra_settings.hide_date")}
                        >
                          <div className="flex items-center gap-1">
                            <ToggleSwitch
                              value={value ?? false}
                              onChange={onChange}
                              size="sm"
                              disabled={watch("extra_settings.hide_date")}
                            />
                            <span className="text-xs">Don{"'"}t show time</span>
                          </div>
                        </Tooltip>
                      </div>
                    )}
                  />
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
};
