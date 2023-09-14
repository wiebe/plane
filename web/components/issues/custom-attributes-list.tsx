import { useEffect } from "react";

import { useRouter } from "next/router";

// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
import { Loader } from "components/ui";
import { CustomTextAttribute } from "components/custom-attributes";

type Props = {
  entityId: string;
  issueId: string;
  projectId: string;
};

export const CustomAttributesList: React.FC<Props> = observer(
  ({ entityId, issueId, projectId }) => {
    const router = useRouter();
    const { workspaceSlug } = router.query;

    const { customAttributes: customAttributesStore } = useMobxStore();
    const { entityAttributes, fetchEntityDetails, fetchEntityDetailsLoader } =
      customAttributesStore;

    const attributes = entityAttributes[entityId] ?? {};

    useEffect(() => {
      if (!entityAttributes[entityId]) {
        if (!workspaceSlug) return;

        fetchEntityDetails(workspaceSlug.toString(), entityId);
      }
    }, [entityAttributes, entityId, fetchEntityDetails, workspaceSlug]);

    return (
      <div>
        {fetchEntityDetailsLoader ? (
          <Loader className="flex items-center gap-2">
            <Loader.Item height="27px" width="90px" />
            <Loader.Item height="27px" width="90px" />
            <Loader.Item height="27px" width="90px" />
          </Loader>
        ) : (
          <div className="flex items-center gap-2">
            {Object.entries(attributes).map(([attributeId, attribute]) => (
              <div key={attributeId}>
                {attribute.type === "text" && (
                  <CustomTextAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={() => {}}
                    projectId={projectId}
                    value={attribute.default_value ?? ""}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
