import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import {
  CheckboxAttributeForm,
  DateTimeAttributeForm,
  EmailAttributeForm,
  FileAttributeForm,
  NumberAttributeForm,
  RelationAttributeForm,
  SelectAttributeForm,
  TextAttributeForm,
  UrlAttributeForm,
} from "components/custom-attributes";
// types
import { ICustomAttribute, TCustomAttributeTypes } from "types";

type Props = {
  attributeDetails: ICustomAttribute;
  objectId: string;
  type: TCustomAttributeTypes;
};

export const AttributeForm: React.FC<Props> = observer((props) => {
  const { attributeDetails, objectId, type } = props;

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes } = useMobxStore();

  const handleUpdateAttribute = async (data: Partial<ICustomAttribute>) => {
    if (!workspaceSlug || !attributeDetails.id || !objectId) return;

    await customAttributes.updateObjectAttribute(
      workspaceSlug.toString(),
      objectId,
      attributeDetails.id,
      data
    );
  };

  const handleDeleteAttribute = async () => {
    if (!workspaceSlug || !attributeDetails.id || !objectId) return;

    await customAttributes.deleteObjectAttribute(
      workspaceSlug.toString(),
      objectId,
      attributeDetails.id
    );
  };

  switch (type) {
    case "checkbox":
      return (
        <CheckboxAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "datetime":
      return (
        <DateTimeAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "email":
      return (
        <EmailAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "file":
      return (
        <FileAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "multi_select":
      return (
        <SelectAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
          multiple
        />
      );
    case "number":
      return (
        <NumberAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "relation":
      return (
        <RelationAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "select":
      return (
        <SelectAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "text":
      return (
        <TextAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    case "url":
      return (
        <UrlAttributeForm
          attributeDetails={attributeDetails}
          handleDeleteAttribute={handleDeleteAttribute}
          handleUpdateAttribute={handleUpdateAttribute}
        />
      );
    default:
      return null;
  }
});
