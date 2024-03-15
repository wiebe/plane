import React, { useState } from "react";

// ui
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button, Loader } from "@plane/ui";
// icons
// types
import { IProject } from "@plane/types";
import { ArchiveProjectModal } from "components/project";

export interface IDeleteProjectSection {
  projectDetails: IProject;
}

export const ArchiveProjectSection: React.FC<IDeleteProjectSection> = (props) => {
  const { projectDetails } = props;
  // states
  const [archiveProjectModal, setArchiveProjectModal] = useState(false);

  return (
    <>
      <ArchiveProjectModal
        isOpen={archiveProjectModal}
        data={projectDetails}
        handleClose={() => setArchiveProjectModal(false)}
      />
      <Disclosure as="div" className="border-t border-custom-border-100">
        {({ open }) => (
          <div className="w-full">
            <Disclosure.Button as="button" type="button" className="flex w-full items-center justify-between py-4">
              <span className="text-xl tracking-tight">Archive project</span>
              {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Disclosure.Button>

            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform opacity-0"
              enterTo="transform opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform opacity-100"
              leaveTo="transform opacity-0"
            >
              <Disclosure.Panel>
                <div className="flex flex-col gap-8 pb-6">
                  <span className="text-sm tracking-tight">
                    Archiving a project will unlist your project from your side navigation although you will still be
                    able to access it from your projects page. You can restore the project or delete it whenever you
                    want.
                  </span>
                  <div>
                    {projectDetails ? (
                      <Button variant="outline-danger" onClick={() => setArchiveProjectModal(true)}>
                        Archive project
                      </Button>
                    ) : (
                      <Loader className="mt-2 w-full">
                        <Loader.Item height="38px" width="144px" />
                      </Loader>
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    </>
  );
};
