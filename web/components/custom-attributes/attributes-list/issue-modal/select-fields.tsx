// mobx
import { useMobxStore } from "lib/mobx/store-provider";
import { observer } from "mobx-react-lite";
// components
import {
  CustomDateTimeAttribute,
  CustomFileAttribute,
  CustomRelationAttribute,
  CustomSelectAttribute,
} from "components/custom-attributes";
// ui
import { Loader } from "components/ui";
// types
import { TCustomAttributeTypes } from "types";

type Props = {
  objectId: string;
  issueId: string;
  onChange: (attributeId: string, val: string | string[] | undefined) => void;
  projectId: string;
  values: { [key: string]: string[] };
};

const SELECT_FIELDS: TCustomAttributeTypes[] = ["datetime", "multi_select", "relation", "select"];

export const CustomAttributesSelectFields: React.FC<Props> = observer((props) => {
  const { objectId, issueId, onChange, projectId, values } = props;

  const { customAttributes } = useMobxStore();

  const attributes = customAttributes.objectAttributes[objectId] ?? {};

  const selectFields = Object.values(attributes).filter((a) => SELECT_FIELDS.includes(a.type));

  return (
    <>
      {customAttributes.fetchObjectDetailsLoader ? (
        <Loader className="flex items-center gap-2">
          <Loader.Item height="27px" width="90px" />
          <Loader.Item height="27px" width="90px" />
          <Loader.Item height="27px" width="90px" />
        </Loader>
      ) : (
        Object.entries(selectFields).map(([attributeId, attribute]) => (
          <div key={attributeId}>
            {attribute.type === "datetime" && (
              <CustomDateTimeAttribute
                attributeDetails={attribute}
                className="bg-transparent border border-custom-border-200 py-1 shadow-custom-shadow-2xs"
                issueId={issueId}
                onChange={(val) => onChange(attribute.id, val ? [val.toISOString()] : undefined)}
                projectId={projectId}
                value={values[attribute.id]?.[0] ? new Date(values[attribute.id]?.[0]) : undefined}
              />
            )}
            {attribute.type === "file" && (
              <CustomFileAttribute
                attributeDetails={attribute}
                className="bg-transparent border border-custom-border-200 py-1 shadow-custom-shadow-2xs"
                issueId={issueId}
                onChange={(val) => onChange(attribute.id, val)}
                projectId={projectId}
                value={values[attribute.id]?.[0]}
              />
            )}
            {attribute.type === "multi_select" && (
              <CustomSelectAttribute
                attributeDetails={attribute}
                className="bg-transparent border border-custom-border-200 py-1 shadow-custom-shadow-2xs"
                issueId={issueId}
                onChange={(val) => onChange(attribute.id, val)}
                projectId={projectId}
                value={values[attribute.id] ?? []}
                multiple
              />
            )}
            {attribute.type === "relation" && (
              <CustomRelationAttribute
                attributeDetails={attribute}
                className="bg-transparent border border-custom-border-200 py-1 shadow-custom-shadow-2xs"
                issueId={issueId}
                onChange={(val) => onChange(attribute.id, val)}
                projectId={projectId}
                value={values[attribute.id]?.[0]}
              />
            )}
            {attribute.type === "select" && (
              <CustomSelectAttribute
                attributeDetails={attribute}
                className="bg-transparent border border-custom-border-200 py-1 shadow-custom-shadow-2xs"
                issueId={issueId}
                onChange={(val) => onChange(attribute.id, val)}
                projectId={projectId}
                value={values[attribute.id]?.[0]}
                multiple={false}
              />
            )}
          </div>
        ))
      )}
    </>
  );
});
