import { useState } from "react";

// components
import { DeleteObjectModal, ObjectModal } from "components/custom-attributes";
// ui
import { CustomMenu } from "components/ui";
// icons
import { TableProperties } from "lucide-react";
// helpers
import { renderEmoji } from "helpers/emoji.helper";
// types
import { ICustomAttribute } from "types";

type Props = {
  object: ICustomAttribute;
};

export const SingleObject: React.FC<Props> = (props) => {
  const { object } = props;

  const [isEditObjectModalOpen, setIsEditObjectModalOpen] = useState(false);
  const [isDeleteObjectModalOpen, setIsDeleteObjectModalOpen] = useState(false);

  return (
    <>
      <ObjectModal
        data={object}
        isOpen={isEditObjectModalOpen}
        onClose={() => setIsEditObjectModalOpen(false)}
      />
      <DeleteObjectModal
        isOpen={isDeleteObjectModalOpen}
        objectToDelete={object}
        onClose={() => setIsDeleteObjectModalOpen(false)}
      />
      <div className="flex items-center justify-between gap-4 py-4">
        <div className={`flex gap-4 ${object.description === "" ? "items-center" : "items-start"}`}>
          <div className="bg-custom-background-80 h-10 w-10 grid place-items-center rounded">
            {object.icon ? (
              renderEmoji(object.icon)
            ) : (
              <TableProperties size={20} strokeWidth={1.5} />
            )}
          </div>
          <div>
            <h5 className="text-sm font-medium">{object.display_name}</h5>
            <p className="text-custom-text-300 text-xs">{object.description}</p>
          </div>
        </div>
        <CustomMenu ellipsis>
          <CustomMenu.MenuItem renderAs="button" onClick={() => setIsEditObjectModalOpen(true)}>
            Edit
          </CustomMenu.MenuItem>
          <CustomMenu.MenuItem renderAs="button" onClick={() => setIsDeleteObjectModalOpen(true)}>
            Delete
          </CustomMenu.MenuItem>
        </CustomMenu>
      </div>
    </>
  );
};
