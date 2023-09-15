import { useEffect } from "react";

import { useRouter } from "next/router";

// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// components
import {
  CustomCheckboxAttribute,
  CustomFileAttribute,
  CustomSelectAttribute,
  CustomTextAttribute,
} from "components/custom-attributes";
// ui
import { Loader } from "components/ui";

type Props = {
  entityId: string;
  issueId: string;
  onSubmit: () => Promise<void>;
  projectId: string;
};

export const CustomAttributesList: React.FC<Props> = observer(
  ({ entityId, issueId, onSubmit, projectId }) => {
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
                {attribute.type === "select" && (
                  <CustomSelectAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={() => {}}
                    projectId={projectId}
                    value={attribute.default_value ?? ""}
                  />
                )}
                {attribute.type === "checkbox" && (
                  <CustomCheckboxAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={() => {}}
                    projectId={projectId}
                    value={attribute.default_value === "checked" ? true : false}
                  />
                )}
                {attribute.type === "file" && (
                  <CustomFileAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={() => {}}
                    projectId={projectId}
                    value={null}
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
