import { useState } from "react";

// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// headless ui
import { Disclosure } from "@headlessui/react";
// ui
import { Loader, ToggleSwitch } from "components/ui";
// icons
import { ChevronDown } from "lucide-react";
// types
import { TCustomAttributeTypes } from "types";

type Props = {
  entityId: string;
  issueId: string;
  onChange: (attributeId: string, val: string | string[] | undefined) => void;
  projectId: string;
  values: { [key: string]: string[] };
};

const DESCRIPTION_FIELDS: TCustomAttributeTypes[] = ["email", "number", "text", "url"];

export const CustomAttributesDescriptionFields: React.FC<Props> = observer((props) => {
  const { entityId, onChange, values } = props;

  const [hideOptionalFields, setHideOptionalFields] = useState(false);

  const { customAttributes } = useMobxStore();

  const attributes = customAttributes.entityAttributes[entityId] ?? {};

  const descriptionFields = Object.values(attributes).filter((a) =>
    DESCRIPTION_FIELDS.includes(a.type)
  );

  return (
    <>
      {customAttributes.fetchEntityDetailsLoader ? (
        <Loader className="space-y-3.5">
          <Loader.Item height="35px" />
          <Loader.Item height="35px" />
          <Loader.Item height="35px" />
        </Loader>
      ) : (
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <div className="flex items-center justify-between gap-2">
                <Disclosure.Button className="font-medium flex items-center gap-2">
                  <ChevronDown
                    className={`transition-all ${open ? "" : "-rotate-90"}`}
                    size={14}
                    strokeWidth={1.5}
                  />
                  Form Attributes
                </Disclosure.Button>
                <div className={`flex items-center gap-1 ${open ? "" : "hidden"}`}>
                  <span className="text-xs">Hide optional fields</span>
                  <ToggleSwitch
                    value={hideOptionalFields}
                    onChange={() => setHideOptionalFields((prev) => !prev)}
                  />
                </div>
              </div>
              <Disclosure.Panel className="space-y-3.5 mt-2">
                {Object.entries(descriptionFields).map(([attributeId, attribute]) => (
                  <div
                    key={attributeId}
                    className={hideOptionalFields && attribute.is_required ? "hidden" : ""}
                  >
                    <input
                      type={attribute.type}
                      className="border border-custom-border-200 rounded w-full px-2 py-1.5 text-xs placeholder:text-custom-text-400 focus:outline-none"
                      placeholder={attribute.display_name}
                      min={attribute.extra_settings.divided_by ? 0 : undefined}
                      max={attribute.extra_settings.divided_by ?? undefined}
                      value={values[attribute.id]?.[0] ?? attribute.default_value}
                      onChange={(e) => onChange(attribute.id, e.target.value)}
                      required={attribute.is_required}
                    />
                    {attribute.type === "number" &&
                      attribute.extra_settings?.representation !== "numerical" && (
                        <span className="text-custom-text-400 text-[10px]">
                          Maximum value: {attribute.extra_settings?.divided_by}
                        </span>
                      )}
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </>
  );
});
