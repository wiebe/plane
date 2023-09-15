import React, { useState } from "react";

// headless ui
import { Combobox, Transition } from "@headlessui/react";
import { Search } from "lucide-react";

type Props = {
  onChange: (value: string[]) => void;
  value: string[];
};

const FILE_EXTENSIONS: {
  [category: string]: string[];
} = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".svg", ".eps", ".psd", ".ai"],
  video: [".mp4", ".avi", ".mkv", ".mpg", ".mpeg", ".flv", ".wmv"],
  audio: [".mp3", ".wav", ".ogg", ".flac", ".aac"],
  document: [
    ".txt",
    ".doc",
    ".docx",
    ".pdf",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".html",
    ".htm",
    ".csv",
    ".xml",
  ],
};

const searchExtensions = (query: string) => {
  query = query.toLowerCase();
  const filteredExtensions: {
    [category: string]: string[];
  } = {};

  for (const category in FILE_EXTENSIONS) {
    const extensions = FILE_EXTENSIONS[category].filter((extension) =>
      extension.toLowerCase().includes(query)
    );
    if (extensions.length > 0) {
      filteredExtensions[category] = extensions;
    }
  }

  return filteredExtensions;
};

export const FileFormatsDropdown: React.FC<Props> = ({ onChange, value }) => {
  const [query, setQuery] = useState("");

  const options = searchExtensions(query);

  return (
    <Combobox
      as="div"
      value={value}
      onChange={(val) => onChange(val)}
      className="relative flex-shrink-0 text-left"
      multiple
    >
      {({ open }: { open: boolean }) => (
        <>
          <Combobox.Button className="px-3 py-2 bg-custom-background-100 rounded border border-custom-border-200 text-xs w-full text-left">
            {value.length > 0 ? value.join(", ") : "Select file formats"}
          </Combobox.Button>
          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Combobox.Options className="absolute z-10 bottom-full mb-2 border-[0.5px] border-custom-border-300 p-1 w-full max-h-64 flex flex-col rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none overflow-hidden">
              <div className="flex w-full items-center justify-start rounded-sm border-[0.6px] border-custom-border-200 bg-custom-background-90 px-2 mb-1">
                <Search className="text-custom-text-400" size={12} />
                <Combobox.Input
                  className="w-full bg-transparent py-1 px-2 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search..."
                  displayValue={(assigned: any) => assigned?.name}
                />
              </div>
              <div className="h-full overflow-y-auto">
                {Object.keys(options).map((category) =>
                  options[category].map((extension) => (
                    <Combobox.Option
                      key={extension}
                      value={extension}
                      className={({ active, selected }) =>
                        `flex items-center gap-1 cursor-pointer select-none truncate rounded px-1 py-1.5 accent-custom-primary-100 ${
                          active ? "bg-custom-background-80" : ""
                        } ${selected ? "text-custom-text-100" : "text-custom-text-200"}`
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <input
                            type="checkbox"
                            className="scale-75"
                            checked={value.includes(extension)}
                            readOnly
                          />
                          {extension}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </div>
            </Combobox.Options>
          </Transition>
        </>
      )}
    </Combobox>
  );
};
