import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { mutate } from "swr";

// mobx
import { observer } from "mobx-react-lite";
import { useMobxStore } from "lib/mobx/store-provider";
// headless ui
import { Dialog, Transition } from "@headlessui/react";
// services
import modulesService from "services/modules.service";
import issuesService from "services/issues.service";
import inboxServices from "services/inbox.service";
// hooks
import useUser from "hooks/use-user";
import useIssuesView from "hooks/use-issues-view";
import useCalendarIssuesView from "hooks/use-calendar-issues-view";
import useToast from "hooks/use-toast";
import useInboxView from "hooks/use-inbox-view";
import useSpreadsheetIssuesView from "hooks/use-spreadsheet-issues-view";
import useProjects from "hooks/use-projects";
import useMyIssues from "hooks/my-issues/use-my-issues";
// components
import { IssueForm, ConfirmIssueDiscard } from "components/issues";
// types
import type { IIssue } from "types";
// fetch-keys
import {
  PROJECT_ISSUES_DETAILS,
  USER_ISSUE,
  SUB_ISSUES,
  PROJECT_ISSUES_LIST_WITH_PARAMS,
  CYCLE_ISSUES_WITH_PARAMS,
  MODULE_ISSUES_WITH_PARAMS,
  CYCLE_DETAILS,
  MODULE_DETAILS,
  VIEW_ISSUES,
  INBOX_ISSUES,
  PROJECT_DRAFT_ISSUES_LIST_WITH_PARAMS,
} from "constants/fetch-keys";
// constants
import { INBOX_ISSUE_SOURCE } from "constants/inbox";

export type TIssueFormAttributes =
  | "project"
  | "name"
  | "description"
  | "entity"
  | "state"
  | "priority"
  | "assignee"
  | "label"
  | "startDate"
  | "dueDate"
  | "estimate"
  | "parent"
  | "all";

export interface IssuesModalProps {
  data?: IIssue | null;
  fieldsToShow?: TIssueFormAttributes[];
  handleClose: () => void;
  isOpen: boolean;
  isUpdatingSingleIssue?: boolean;
  onSubmit?: (data: Partial<IIssue>) => Promise<void>;
  prePopulateData?: Partial<IIssue>;
}

export const CreateUpdateIssueModal: React.FC<IssuesModalProps> = observer(
  ({
    data,
    fieldsToShow = ["all"],
    handleClose,
    isOpen,
    isUpdatingSingleIssue = false,
    onSubmit,
    prePopulateData,
  }) => {
    // states
    const [createMore, setCreateMore] = useState(false);
    const [formDirtyState, setFormDirtyState] = useState<any>(null);
    const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
    const [activeProject, setActiveProject] = useState<string | null>(null);

    const [customAttributesList, setCustomAttributesList] = useState<{ [key: string]: string[] }>(
      {}
    );

    const router = useRouter();
    const { workspaceSlug, projectId, cycleId, moduleId, viewId, inboxId } = router.query;

    const { customAttributeValues: customAttributeValuesStore } = useMobxStore();
    const { createAttributeValue } = customAttributeValuesStore;

    const { displayFilters, params } = useIssuesView();
    const { params: calendarParams } = useCalendarIssuesView();
    const { ...viewGanttParams } = params;
    const { params: inboxParams } = useInboxView();
    const { params: spreadsheetParams } = useSpreadsheetIssuesView();

    const { user } = useUser();
    const { projects } = useProjects();

    const { groupedIssues, mutateMyIssues } = useMyIssues(workspaceSlug?.toString());

    const { setToastAlert } = useToast();

    if (cycleId) prePopulateData = { ...prePopulateData, cycle: cycleId as string };
    if (moduleId) prePopulateData = { ...prePopulateData, module: moduleId as string };
    if (router.asPath.includes("my-issues") || router.asPath.includes("assigned"))
      prePopulateData = {
        ...prePopulateData,
        assignees: [...(prePopulateData?.assignees ?? []), user?.id ?? ""],
      };

    const onClose = () => {
      if (formDirtyState !== null) {
        setShowConfirmDiscard(true);
      } else {
        handleClose();
        setActiveProject(null);
        setCustomAttributesList({});
      }
    };

    const onDiscardClose = () => {
      handleClose();
      setActiveProject(null);
      setCustomAttributesList({});
    };

    const handleFormDirty = (data: any) => {
      setFormDirtyState(data);
    };

    useEffect(() => {
      // if modal is closed, reset active project to null
      // and return to avoid activeProject being set to some other project
      if (!isOpen) {
        setActiveProject(null);
        return;
      }

      // if data is present, set active project to the project of the
      // issue. This has more priority than the project in the url.
      if (data && data.project) {
        setActiveProject(data.project);
        return;
      }

      // if data is not present, set active project to the project
      // in the url. This has the least priority.
      if (projects && projects.length > 0 && !activeProject)
        setActiveProject(projects?.find((p) => p.id === projectId)?.id ?? projects?.[0].id ?? null);
    }, [activeProject, data, projectId, projects, isOpen]);

    const addIssueToCycle = async (issueId: string, cycleId: string) => {
      if (!workspaceSlug || !activeProject) return;

      await issuesService
        .addIssueToCycle(
          workspaceSlug as string,
          activeProject ?? "",
          cycleId,
          {
            issues: [issueId],
          },
          user
        )
        .then(() => {
          if (cycleId) {
            mutate(CYCLE_ISSUES_WITH_PARAMS(cycleId, params));
            mutate(CYCLE_DETAILS(cycleId as string));
          }
        });
    };

    const addIssueToModule = async (issueId: string, moduleId: string) => {
      if (!workspaceSlug || !activeProject) return;

      await modulesService
        .addIssuesToModule(
          workspaceSlug as string,
          activeProject ?? "",
          moduleId as string,
          {
            issues: [issueId],
          },
          user
        )
        .then(() => {
          if (moduleId) {
            mutate(MODULE_ISSUES_WITH_PARAMS(moduleId as string, params));
            mutate(MODULE_DETAILS(moduleId as string));
          }
        });
    };

    const addIssueToInbox = async (formData: Partial<IIssue>) => {
      if (!workspaceSlug || !activeProject || !inboxId) return;

      const payload = {
        issue: {
          name: formData.name,
          description: formData.description,
          description_html: formData.description_html,
          priority: formData.priority,
        },
        source: INBOX_ISSUE_SOURCE,
      };

      await inboxServices
        .createInboxIssue(
          workspaceSlug.toString(),
          activeProject.toString(),
          inboxId.toString(),
          payload,
          user
        )
        .then((res) => {
          setToastAlert({
            type: "success",
            title: "Success!",
            message: "Issue created successfully.",
          });

          router.push(
            `/${workspaceSlug}/projects/${activeProject}/inbox/${inboxId}?inboxIssueId=${res.issue_inbox[0].id}`
          );

          mutate(INBOX_ISSUES(inboxId.toString(), inboxParams));
        })
        .catch(() => {
          setToastAlert({
            type: "error",
            title: "Error!",
            message: "Issue could not be created. Please try again.",
          });
        });
    };

    const calendarFetchKey = cycleId
      ? CYCLE_ISSUES_WITH_PARAMS(cycleId.toString(), calendarParams)
      : moduleId
      ? MODULE_ISSUES_WITH_PARAMS(moduleId.toString(), calendarParams)
      : viewId
      ? VIEW_ISSUES(viewId.toString(), calendarParams)
      : PROJECT_ISSUES_LIST_WITH_PARAMS(activeProject?.toString() ?? "", calendarParams);

    const spreadsheetFetchKey = cycleId
      ? CYCLE_ISSUES_WITH_PARAMS(cycleId.toString(), spreadsheetParams)
      : moduleId
      ? MODULE_ISSUES_WITH_PARAMS(moduleId.toString(), spreadsheetParams)
      : viewId
      ? VIEW_ISSUES(viewId.toString(), spreadsheetParams)
      : PROJECT_ISSUES_LIST_WITH_PARAMS(activeProject?.toString() ?? "", spreadsheetParams);

    const ganttFetchKey = cycleId
      ? CYCLE_ISSUES_WITH_PARAMS(cycleId.toString())
      : moduleId
      ? MODULE_ISSUES_WITH_PARAMS(moduleId.toString())
      : viewId
      ? VIEW_ISSUES(viewId.toString(), viewGanttParams)
      : PROJECT_ISSUES_LIST_WITH_PARAMS(activeProject?.toString() ?? "");

    const createIssue = async (payload: Partial<IIssue>) => {
      if (!workspaceSlug || !activeProject) return;

      let issueToReturn: Partial<IIssue> = {};

      if (inboxId) await addIssueToInbox(payload);
      else
        await issuesService
          .createIssues(workspaceSlug as string, activeProject ?? "", payload, user)
          .then(async (res) => {
            issueToReturn = res;
            mutate(PROJECT_ISSUES_LIST_WITH_PARAMS(activeProject ?? "", params));
            if (payload.cycle && payload.cycle !== "") await addIssueToCycle(res.id, payload.cycle);
            if (payload.module && payload.module !== "")
              await addIssueToModule(res.id, payload.module);

            if (displayFilters.layout === "calendar") mutate(calendarFetchKey);
            if (displayFilters.layout === "gantt_chart")
              mutate(ganttFetchKey, {
                start_target_date: true,
                order_by: "sort_order",
              });
            if (displayFilters.layout === "spreadsheet") mutate(spreadsheetFetchKey);
            if (groupedIssues) mutateMyIssues();

            setToastAlert({
              type: "success",
              title: "Success!",
              message: "Issue created successfully.",
            });

            if (payload.assignees_list?.some((assignee) => assignee === user?.id))
              mutate(USER_ISSUE(workspaceSlug as string));

            if (payload.parent && payload.parent !== "") mutate(SUB_ISSUES(payload.parent));
          })
          .catch(() => {
            setToastAlert({
              type: "error",
              title: "Error!",
              message: "Issue could not be created. Please try again.",
            });
          });

      if (!createMore) onDiscardClose();

      return issueToReturn;
    };

    const createDraftIssue = async () => {
      if (!workspaceSlug || !activeProject || !user) return;

      const payload: Partial<IIssue> = {
        ...formDirtyState,
      };

      await issuesService
        .createDraftIssue(workspaceSlug as string, activeProject ?? "", payload, user)
        .then(() => {
          mutate(PROJECT_DRAFT_ISSUES_LIST_WITH_PARAMS(activeProject ?? "", params));
          if (groupedIssues) mutateMyIssues();

          setToastAlert({
            type: "success",
            title: "Success!",
            message: "Draft Issue created successfully.",
          });

          handleClose();
          setActiveProject(null);
          setFormDirtyState(null);
          setShowConfirmDiscard(false);

          if (payload.assignees_list?.some((assignee) => assignee === user?.id))
            mutate(USER_ISSUE(workspaceSlug as string));

          if (payload.parent && payload.parent !== "") mutate(SUB_ISSUES(payload.parent));
        })
        .catch(() => {
          setToastAlert({
            type: "error",
            title: "Error!",
            message: "Issue could not be created. Please try again.",
          });
        });
    };

    const updateIssue = async (payload: Partial<IIssue>) => {
      if (!user) return;

      let issueToReturn: Partial<IIssue> = {};

      await issuesService
        .patchIssue(workspaceSlug as string, activeProject ?? "", data?.id ?? "", payload, user)
        .then((res) => {
          issueToReturn = res;

          if (isUpdatingSingleIssue) {
            mutate<IIssue>(PROJECT_ISSUES_DETAILS, (prevData) => ({ ...prevData, ...res }), false);
          } else {
            if (displayFilters.layout === "calendar") mutate(calendarFetchKey);
            if (displayFilters.layout === "spreadsheet") mutate(spreadsheetFetchKey);
            if (payload.parent) mutate(SUB_ISSUES(payload.parent.toString()));
            mutate(PROJECT_ISSUES_LIST_WITH_PARAMS(activeProject ?? "", params));
          }

          if (payload.cycle && payload.cycle !== "") addIssueToCycle(res.id, payload.cycle);
          if (payload.module && payload.module !== "") addIssueToModule(res.id, payload.module);

          if (!createMore) onDiscardClose();

          setToastAlert({
            type: "success",
            title: "Success!",
            message: "Issue updated successfully.",
          });
        })
        .catch(() => {
          setToastAlert({
            type: "error",
            title: "Error!",
            message: "Issue could not be updated. Please try again.",
          });
        });

      return issueToReturn;
    };

    const handleFormSubmit = async (formData: Partial<IIssue>) => {
      if (!workspaceSlug || !activeProject) return;

      // set the fixed issue properties for the payload
      let payload: Partial<IIssue> = {
        description_html: formData.description_html ?? "<p></p>",
        entity: formData.entity,
        name: formData.name,
        state: formData.state,
      };

      // if entity is null, set the default object entity properties for the payload
      if (formData.entity === null)
        payload = {
          ...payload,
          ...formData,
          assignees_list: formData.assignees ?? [],
          labels_list: formData.labels ?? [],
        };

      let issueResponse: Partial<IIssue> | undefined = {};

      if (!data) issueResponse = await createIssue(payload);
      else issueResponse = await updateIssue(payload);

      // create custom attribute values, if any
      if (
        payload.entity !== null &&
        issueResponse &&
        issueResponse.id &&
        Object.keys(customAttributesList).length > 0
      )
        await createAttributeValue(workspaceSlug.toString(), activeProject, issueResponse.id, {
          issue_properties: customAttributesList,
        });

      if (onSubmit) await onSubmit(payload);
    };

    const handleCustomAttributesChange = (
      attributeId: string,
      val: string | string[] | undefined
    ) => {
      if (!val) {
        setCustomAttributesList((prev) => {
          const newCustomAttributesList = { ...prev };
          delete newCustomAttributesList[attributeId];

          return newCustomAttributesList;
        });

        return;
      }

      setCustomAttributesList((prev) => ({
        ...prev,
        [attributeId]: Array.isArray(val) ? val : [val],
      }));
    };

    if (!projects || projects.length === 0) return null;

    return (
      <>
        <ConfirmIssueDiscard
          isOpen={showConfirmDiscard}
          handleClose={() => setShowConfirmDiscard(false)}
          onConfirm={createDraftIssue}
          onDiscard={() => {
            handleClose();
            setActiveProject(null);
            setFormDirtyState(null);
            setShowConfirmDiscard(false);
          }}
        />

        <Transition.Root show={isOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-20" onClose={onClose}>
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

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="my-10 flex items-center justify-center p-4 text-center sm:p-0 md:my-20">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform rounded-lg border border-custom-border-200 bg-custom-background-100 p-5 text-left shadow-xl transition-all sm:w-full sm:max-w-2xl">
                    <IssueForm
                      handleFormSubmit={handleFormSubmit}
                      initialData={data ?? prePopulateData}
                      createMore={createMore}
                      setCreateMore={setCreateMore}
                      handleClose={onClose}
                      handleDiscardClose={onDiscardClose}
                      setIsConfirmDiscardOpen={setShowConfirmDiscard}
                      projectId={activeProject ?? ""}
                      setActiveProject={setActiveProject}
                      status={data ? true : false}
                      user={user}
                      customAttributesList={customAttributesList}
                      handleCustomAttributesChange={handleCustomAttributesChange}
                      fieldsToShow={fieldsToShow}
                      handleFormDirty={handleFormDirty}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    );
  }
);
