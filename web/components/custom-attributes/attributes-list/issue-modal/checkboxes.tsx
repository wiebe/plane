import { useEffect } from "react";

import { useRouter } from "next/router";

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

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes: customAttributesStore } = useMobxStore();
  const { entityAttributes, fetchEntityDetails, fetchEntityDetailsLoader } = customAttributesStore;

  const attributes = entityAttributes[entityId] ?? {};

  // fetch entity details
  useEffect(() => {
    if (!entityAttributes[entityId]) {
      if (!workspaceSlug) return;

      fetchEntityDetails(workspaceSlug.toString(), entityId);
    }
  }, [entityAttributes, entityId, fetchEntityDetails, workspaceSlug]);

  const checkboxFields = Object.values(attributes).filter((a) => a.type === "checkbox");

  return (
    <>
      {fetchEntityDetailsLoader ? (
        <Loader className="flex items-center gap-2">
          <Loader.Item height="27px" width="90px" />
          <Loader.Item height="27px" width="90px" />
          <Loader.Item height="27px" width="90px" />
        </Loader>
      ) : (
        <div>
          <h5 className="text-sm">Checkboxes</h5>
          <div className="mt-3.5 space-y-4">
            {Object.entries(checkboxFields).map(([attributeId, attribute]) => (
              <div key={attributeId} className="flex items-center gap-2">
                <Tooltip tooltipContent={attribute.display_name} position="top-left">
                  <p className="text-xs text-custom-text-300 w-1/3 truncate">
                    {attribute.display_name}
                  </p>
                </Tooltip>
                <div className="w-2/3 flex-shrink-0">
                  {attribute.type === "checkbox" && (
                    <CustomCheckboxAttribute
                      attributeDetails={attribute}
                      issueId={issueId}
                      onChange={(val) => onChange(attribute.id, [`${val}`])}
                      projectId={projectId}
                      value={values[attribute.id]?.[0] === "true" ? true : false}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
});
