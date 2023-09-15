import { useEffect } from "react";

import { useRouter } from "next/router";

// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// components
import {
  CustomCheckboxAttribute,
  CustomDateTimeAttribute,
  CustomEmailAttribute,
  CustomFileAttribute,
  CustomNumberAttribute,
  CustomRelationAttribute,
  CustomSelectAttribute,
  CustomTextAttribute,
  CustomUrlAttribute,
} from "components/custom-attributes";
// ui
import { Loader } from "components/ui";

type Props = {
  entityId: string;
  issueId: string;
  onChange: (attributeId: string, val: string[]) => Promise<void>;
  projectId: string;
  values: { [key: string]: string[] };
};

export const IssueModalCustomAttributesList: React.FC<Props> = observer(
  ({ entityId, issueId, onChange, projectId, values }) => {
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
      <>
        {fetchEntityDetailsLoader ? (
          <Loader className="flex items-center gap-2">
            <Loader.Item height="27px" width="90px" />
            <Loader.Item height="27px" width="90px" />
            <Loader.Item height="27px" width="90px" />
          </Loader>
        ) : (
          <>
            {Object.entries(attributes).map(([attributeId, attribute]) => (
              <div key={attributeId}>
                {attribute.type === "checkbox" && (
                  <CustomCheckboxAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={attribute.default_value === "checked" ? true : false}
                  />
                )}
                {attribute.type === "datetime" && (
                  <CustomDateTimeAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={
                      attribute.default_value !== "" ? new Date(attribute.default_value) : undefined
                    }
                  />
                )}
                {attribute.type === "email" && (
                  <CustomEmailAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={attribute.default_value}
                  />
                )}
                {attribute.type === "file" && (
                  <CustomFileAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={undefined}
                  />
                )}
                {attribute.type === "multi_select" && (
                  <CustomSelectAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string[]) => onChange(attribute.id, val)}
                    projectId={projectId}
                    value={[]}
                    multiple
                  />
                )}
                {attribute.type === "number" && (
                  <CustomNumberAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={
                      attribute.default_value !== ""
                        ? parseInt(attribute.default_value, 10)
                        : undefined
                    }
                  />
                )}
                {attribute.type === "relation" && (
                  <CustomRelationAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={attribute.default_value !== "" ? attribute.default_value : undefined}
                  />
                )}
                {attribute.type === "select" && (
                  <CustomSelectAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={attribute.default_value !== "" ? attribute.default_value : undefined}
                  />
                )}
                {attribute.type === "text" && (
                  <CustomTextAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => onChange(attribute.id, [val])}
                    projectId={projectId}
                    value={attribute.default_value}
                  />
                )}
                {attribute.type === "url" && (
                  <CustomUrlAttribute
                    attributeDetails={attribute}
                    issueId={issueId}
                    onChange={(val: string) => {
                      console.log(val);
                      onChange(attribute.id, [val]);
                    }}
                    projectId={projectId}
                    value={values[attribute.id]?.[0]}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </>
    );
  }
);
