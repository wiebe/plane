import React from "react";

// headless ui
import { Dialog, Transition } from "@headlessui/react";
import {
  TextAttributeForm,
  Input,
  TypesDropdown,
  NumberAttributeForm,
  CheckboxAttributeForm,
  RelationAttributeForm,
  DateTimeAttributeForm,
  UrlAttributeForm,
  EmailAttributeForm,
  FileAttributeForm,
  SelectAttributeForm,
} from "components/custom-attributes";
import { CUSTOM_ATTRIBUTES_LIST } from "constants/custom-attributes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<void>;
};

export const ObjectModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-custom-backdrop bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 h-full w-full z-20">
          <div className="flex items-center justify-center h-full w-full p-4 sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="bg-custom-background-100 p-6 w-1/2 h-[85%] flex flex-col rounded-xl">
                <h3 className="text-2xl font-semibold">New Object</h3>
                <div className="mt-5 space-y-5 h-full overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 bg-custom-background-80 grid place-items-center rounded text-sm">
                        🚀
                      </div>
                      <Input placeholder="Enter Object Title" />
                    </div>
                    <textarea
                      name="objectDescription"
                      id="objectDescription"
                      className="placeholder:text-custom-text-400 text-xs px-3 py-2 rounded bg-custom-background-100 border border-custom-border-200 w-full focus:outline-none"
                      cols={30}
                      rows={5}
                      placeholder="Enter Object Description"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Attributes</h4>
                    <div className="mt-2 space-y-2">
                      {/* TODO: Map over attributes */}
                      <TextAttributeForm />
                      <NumberAttributeForm />
                      <CheckboxAttributeForm />
                      <RelationAttributeForm />
                      <DateTimeAttributeForm />
                      <UrlAttributeForm />
                      <EmailAttributeForm />
                      <FileAttributeForm />
                      <SelectAttributeForm />

                      {/* <CUSTOM_ATTRIBUTES_LIST.text.component />
                      <CUSTOM_ATTRIBUTES_LIST.number.component />
                      <CUSTOM_ATTRIBUTES_LIST.checkbox.component />
                      <CUSTOM_ATTRIBUTES_LIST.relation.component />
                      <CUSTOM_ATTRIBUTES_LIST.datetime.component />
                      <CUSTOM_ATTRIBUTES_LIST.url.component />
                      <CUSTOM_ATTRIBUTES_LIST.email.component />
                      <CUSTOM_ATTRIBUTES_LIST.files.component />
                      <CUSTOM_ATTRIBUTES_LIST.select.component />
                      <CUSTOM_ATTRIBUTES_LIST.multi_select.component /> */}
                    </div>
                    <div className="mt-3">
                      <TypesDropdown />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
