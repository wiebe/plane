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
  handleDeleteObject: () => void;
  handleEditObject: () => void;
};

export const SingleObject: React.FC<Props> = (props) => {
  const { object, handleDeleteObject, handleEditObject } = props;

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className={`flex gap-4 ${object.description === "" ? "items-center" : "items-start"}`}>
        <div className="bg-custom-background-80 h-10 w-10 grid place-items-center rounded">
          {object.icon ? renderEmoji(object.icon) : <TableProperties size={20} strokeWidth={1.5} />}
        </div>
        <div>
          <h5 className="text-sm font-medium">{object.display_name}</h5>
          <p className="text-custom-text-300 text-xs">{object.description}</p>
        </div>
      </div>
      <CustomMenu ellipsis>
        <CustomMenu.MenuItem renderAs="button" onClick={handleEditObject}>
          Edit
        </CustomMenu.MenuItem>
        <CustomMenu.MenuItem renderAs="button" onClick={handleDeleteObject}>
          Delete
        </CustomMenu.MenuItem>
      </CustomMenu>
    </div>
  );
};
