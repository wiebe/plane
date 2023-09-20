import { useEffect, useState } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { DeleteObjectModal, SingleObject } from "components/custom-attributes";
// ui
import { EmptyState, Loader } from "components/ui";
// assets
import emptyCustomObjects from "public/empty-state/custom-objects.svg";
// types
import { ICustomAttribute } from "types";

type Props = {
  handleEditObject: (object: ICustomAttribute) => void;
  projectId: string;
};

export const ObjectsList: React.FC<Props> = observer(({ handleEditObject, projectId }) => {
  const [deleteObjectModal, setDeleteObjectModal] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<ICustomAttribute | null>(null);

  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes } = useMobxStore();

  const handleDeleteObject = async (object: ICustomAttribute) => {
    setObjectToDelete(object);
    setDeleteObjectModal(true);
  };

  useEffect(() => {
    if (!workspaceSlug) return;

    if (!customAttributes.entities)
      customAttributes.fetchEntities(workspaceSlug.toString(), projectId);
  }, [customAttributes, projectId, workspaceSlug]);

  return (
    <>
      <DeleteObjectModal
        isOpen={deleteObjectModal}
        objectToDelete={objectToDelete}
        onClose={() => {
          setDeleteObjectModal(false);

          setTimeout(() => {
            setObjectToDelete(null);
          }, 300);
        }}
      />
      <div className="divide-y divide-custom-border-100">
        {customAttributes.entities ? (
          customAttributes.entities.length > 0 ? (
            customAttributes.entities.map((entity) => (
              <SingleObject
                key={entity.id}
                object={entity}
                handleDeleteObject={() => handleDeleteObject(entity)}
                handleEditObject={() => handleEditObject(entity)}
              />
            ))
          ) : (
            <div className="bg-custom-background-90 border border-custom-border-100 rounded max-w-3xl mt-10 mx-auto">
              <EmptyState
                title="No custom objects yet"
                description="You can think of Pages as an AI-powered notepad."
                image={emptyCustomObjects}
                isFullScreen={false}
              />
            </div>
          )
        ) : (
          <Loader className="space-y-4">
            <Loader.Item height="60px" />
            <Loader.Item height="60px" />
            <Loader.Item height="60px" />
          </Loader>
        )}
      </div>
    </>
  );
});
