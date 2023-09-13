import { useEffect, useState } from "react";

import { useRouter } from "next/router";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { DeleteObjectModal } from "components/custom-attributes";
// ui
import { CustomMenu, Loader } from "components/ui";
// icons
import { TableProperties } from "lucide-react";
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

  const { customAttributes: customAttributesStore } = useMobxStore();
  const { entities, fetchEntities } = customAttributesStore;

  const handleDeleteObject = async (object: ICustomAttribute) => {
    setObjectToDelete(object);
    setDeleteObjectModal(true);
  };

  useEffect(() => {
    if (!workspaceSlug) return;

    if (!entities) fetchEntities(workspaceSlug.toString(), projectId);
  }, [entities, fetchEntities, projectId, workspaceSlug]);

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
      <div className="space-y-4 divide-y divide-custom-border-100">
        {entities ? (
          entities.length > 0 ? (
            entities.map((entity) => (
              <div key={entity.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="bg-custom-background-80 h-10 w-10 grid place-items-center rounded">
                    <TableProperties size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">{entity.display_name}</h5>
                    <p className="text-custom-text-300 text-xs">{entity.description}</p>
                  </div>
                </div>
                <CustomMenu ellipsis>
                  <CustomMenu.MenuItem renderAs="button" onClick={() => handleEditObject(entity)}>
                    Edit
                  </CustomMenu.MenuItem>
                  <CustomMenu.MenuItem renderAs="button" onClick={() => handleDeleteObject(entity)}>
                    Delete
                  </CustomMenu.MenuItem>
                </CustomMenu>
              </div>
            ))
          ) : (
            <p className="text-sm text-custom-text-200 text-center">No objects present</p>
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
