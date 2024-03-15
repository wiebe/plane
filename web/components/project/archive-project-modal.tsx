import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import { Dialog, Transition } from "@headlessui/react";
// hooks
import { useProject } from "hooks/store";
// ui
import { Button, TOAST_TYPE, setToast } from "@plane/ui";
// types
import { IProject } from "@plane/types";

type Props = {
  data?: IProject;
  dataId?: string | null | undefined;
  handleClose: () => void;
  isOpen: boolean;
};

export const ArchiveProjectModal: React.FC<Props> = observer((props) => {
  const { dataId, data, isOpen, handleClose } = props;
  // states
  const [isArchiving, setIsArchiving] = useState(false);
  // router
  const router = useRouter();
  const { workspaceSlug } = router.query;
  // store hooks
  const { getProjectById, archiveProject } = useProject();

  if (!dataId && !data) return null;

  const project = data ? data : getProjectById(dataId!);

  const onClose = () => {
    setIsArchiving(false);
    handleClose();
  };

  const handleArchiveProject = async () => {
    if (!workspaceSlug || !project) return;

    setIsArchiving(true);
    await archiveProject(workspaceSlug.toString(), project.id)
      .then(() => {
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Archive success",
          message: "Your archives can be found in project archives.",
        });
        onClose();
      })
      .catch(() =>
        setToast({
          type: TOAST_TYPE.ERROR,
          title: "Error!",
          message: "Project could not be archived. Please try again.",
        })
      )
      .finally(() => setIsArchiving(false));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-custom-backdrop transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-custom-background-100 text-left shadow-custom-shadow-md transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-5 py-4">
                  <h3 className="text-xl font-medium 2xl:text-2xl">Archive {project?.name}</h3>
                  <p className="mt-3 text-sm text-custom-text-200">
                    This project and its issues, cycles, modules, and pages will be archived. Its issues won{"'"}t
                    appear in search. Only project admins can restore the project.
                  </p>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button variant="neutral-primary" size="sm" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button size="sm" tabIndex={1} onClick={handleArchiveProject} loading={isArchiving}>
                      {isArchiving ? "Archiving" : "Archive"}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
