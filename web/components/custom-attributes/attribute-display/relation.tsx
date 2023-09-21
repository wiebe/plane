import React, { useRef, useState } from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// headless ui
import { Combobox } from "@headlessui/react";
// services
import cyclesService from "services/cycles.service";
import modulesService from "services/modules.service";
// hooks
import useProjectMembers from "hooks/use-project-members";
import useDynamicDropdownPosition from "hooks/use-dynamic-dropdown";
// ui
import { Avatar } from "components/ui";
// icons
import { Search } from "lucide-react";
// types
import { ICustomAttribute } from "types";
// fetch-keys
import { CYCLES_LIST, MODULE_LIST } from "constants/fetch-keys";

type Props = {
  attributeDetails: ICustomAttribute;
  className?: string;
  projectId: string;
  value: string | undefined;
  onChange: (val: string | undefined) => void;
};

export const CustomRelationAttribute: React.FC<Props> = ({
  attributeDetails,
  className = "",
  onChange,
  projectId,
  value,
}) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownOptionsRef = useRef<HTMLUListElement>(null);

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

  const { members } = useProjectMembers(workspaceSlug?.toString(), projectId);

  const optionsList =
    attributeDetails.unit === "cycle"
      ? cycles?.map((c) => ({ id: c.id, query: c.name, label: c.name }))
      : attributeDetails.unit === "module"
      ? modules?.map((m) => ({ id: m.id, query: m.name, label: m.name }))
      : attributeDetails.unit === "user"
      ? members?.map((m) => ({
          id: m.member.id,
          query: m.member.display_name,
          label: (
            <div className="flex items-center gap-2">
              <Avatar user={m.member} />
              {m.member.is_bot ? m.member.first_name : m.member.display_name}
            </div>
          ),
        }))
      : [];

  const selectedOption = (optionsList ?? []).find((option) => option.id === value);

  const options = (optionsList ?? []).filter((option) =>
    option.query.toLowerCase().includes(query.toLowerCase())
  );

  useDynamicDropdownPosition(isOpen, () => setIsOpen(false), dropdownButtonRef, dropdownOptionsRef);

  return (
    <Combobox
      as="div"
      value={value}
      onChange={(val) => onChange(val)}
      className="flex-shrink-0 text-left flex items-center"
    >
      {({ open }: { open: boolean }) => (
        <>
          <Combobox.Button
            ref={dropdownButtonRef}
            className={`flex items-center text-xs rounded px-2.5 py-0.5 truncate w-min max-w-full text-left bg-custom-background-80 ${className}`}
          >
            {selectedOption?.label ?? `Select ${attributeDetails.unit}`}
          </Combobox.Button>
          <Combobox.Options
            ref={dropdownOptionsRef}
            className="fixed z-10 border border-custom-border-300 px-2 py-2.5 rounded bg-custom-background-100 text-xs shadow-custom-shadow-rg focus:outline-none w-48 whitespace-nowrap mt-1"
          >
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
                      {option.label}
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
        </>
      )}
    </Combobox>
  );
};
