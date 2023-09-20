// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// components
import { CustomCheckboxAttribute } from "components/custom-attributes";
// ui
import { Loader, Tooltip } from "components/ui";

type Props = {
  entityId: string;
  issueId: string;
  onChange: (attributeId: string, val: string | string[] | undefined) => void;
  projectId: string;
  values: { [key: string]: string[] };
};

export const CustomAttributesCheckboxes: React.FC<Props> = observer((props) => {
  const { entityId, issueId, onChange, projectId, values } = props;

  const { customAttributes } = useMobxStore();

  const attributes = customAttributes.entityAttributes[entityId] ?? {};

  const checkboxFields = Object.values(attributes).filter((a) => a.type === "checkbox");

  return (
    <>
      {customAttributes.fetchEntityDetailsLoader ? (
        <Loader className="space-y-3.5">
          <Loader.Item height="35px" />
          <Loader.Item height="35px" />
          <Loader.Item height="35px" />
        </Loader>
      ) : (
        <div className="space-y-4">
          {Object.entries(checkboxFields).map(([attributeId, attribute]) => (
            <div key={attributeId} className="flex items-center gap-2">
              <Tooltip tooltipContent={attribute.display_name} position="top-left">
                <p className="text-xs text-custom-text-300 w-2/5 truncate">
                  {attribute.display_name}
                </p>
              </Tooltip>
              <div className="w-3/5 flex-shrink-0">
                <CustomCheckboxAttribute
                  attributeDetails={attribute}
                  issueId={issueId}
                  onChange={(val) => onChange(attribute.id, [`${val}`])}
                  projectId={projectId}
                  value={values[attribute.id]?.[0] === "true" ? true : false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
});
