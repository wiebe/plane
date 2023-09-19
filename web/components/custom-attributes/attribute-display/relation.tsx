import React, { useState } from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// headless ui
import { Combobox, Transition } from "@headlessui/react";
// services
import cyclesService from "services/cycles.service";
import modulesService from "services/modules.service";
// icons
import { Search } from "lucide-react";
// types
import { ICustomAttribute } from "types";
// fetch-keys
import { CYCLES_LIST, MODULE_LIST } from "constants/fetch-keys";

type Props = {
  attributeDetails: ICustomAttribute;
  issueId: string;
  projectId: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
};

export const CustomRelationAttribute: React.FC<Props> = ({
  attributeDetails,
  onChange,
  projectId,
  value,
}) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const [query, setQuery] = useState("");

  const { data: cycles } = useSWR(
    workspaceSlug && projectId && attributeDetails.unit === "cycle"
      ? CYCLES_LIST(projectId.toString())
      : null,
    workspaceSlug && projectId && attributeDetails.unit === "cycle"
      ? () =>
          cyclesService.getCyclesWithParams(workspaceSlug.toString(), projectId.toString(), "all")
      : null
  );

  const { data: modules } = useSWR(
    workspaceSlug && projectId && attributeDetails.unit === "module"
      ? MODULE_LIST(projectId as string)
      : null,
    workspaceSlug && projectId && attributeDetails.unit === "module"
      ? () => modulesService.getModules(workspaceSlug as string, projectId as string)
      : null
  );

  const optionsList =
    attributeDetails.unit === "cycle"
      ? cycles?.map((c) => ({ id: c.id, name: c.name }))
      : attributeDetails.unit === "module"
      ? modules?.map((m) => ({ id: m.id, name: m.name }))
      : [];

  const selectedOption = (optionsList ?? []).find((option) => option.id === value);

  const options = (optionsList ?? []).filter((option) =>
    option.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Combobox
      as="div"
      value={value}
      onChange={(val) => onChange(val)}
      className="relative flex-shrink-0 text-left"
    >
      {({ open }: { open: boolean }) => (
        <>
          <Combobox.Button className="flex items-center text-xs rounded px-2.5 py-0.5 truncate w-min max-w-full text-left bg-custom-background-80">
            {selectedOption?.name ?? `Select ${attributeDetails.unit}`}
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
            <Combobox.Options className="fixed z-10 mb-2 border-[0.5px] border-custom-border-300 p-1 min-w-[10rem] max-h-60 max-w-[10rem] rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none mt-1 flex flex-col overflow-hidden">
              <div className="flex w-full items-center justify-start rounded-sm border-[0.6px] border-custom-border-200 bg-custom-background-90 px-2 mb-1">
                <Search className="text-custom-text-400" size={12} strokeWidth={1.5} />
                <Combobox.Input
                  className="w-full bg-transparent py-1 px-2 text-xs text-custom-text-200 placeholder:text-custom-text-400 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type to search..."
                  displayValue={(assigned: any) => assigned?.name}
                />
              </div>
              <div className="mt-1 overflow-y-auto">
                {options ? (
                  options.length > 0 ? (
                    options.map((option) => (
                      <Combobox.Option
                        key={option.id}
                        value={option.id}
                        className="flex items-center gap-1 cursor-pointer select-none truncate rounded px-1 py-1.5 hover:bg-custom-background-80 w-full"
                      >
                        <span className="px-1 rounded-sm truncate">{option.name}</span>
                      </Combobox.Option>
                    ))
                  ) : (
                    <p className="text-custom-text-300 text-center py-1">
                      No {attributeDetails.unit}s found
                    </p>
                  )
                ) : (
                  <p className="text-custom-text-300 text-center py-1">Loading...</p>
                )}
              </div>
            </Combobox.Options>
          </Transition>
        </>
      )}
    </Combobox>
  );
};
