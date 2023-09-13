import React, { useState } from "react";

import { useRouter } from "next/router";

// layouts
import { ProjectAuthorizationWrapper } from "layouts/auth-layout";
// hooks
import useToast from "hooks/use-toast";
import useProjectDetails from "hooks/use-project-details";
// components
import { SettingsHeader } from "components/project";
import { ObjectModal, ObjectsList } from "components/custom-attributes";
// ui
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
import { PrimaryButton } from "components/ui";
// helpers
import { truncateText } from "helpers/string.helper";
// types
import type { NextPage } from "next";
import { ICustomAttribute } from "types";

const ControlSettings: NextPage = () => {
  const [isCreateObjectModalOpen, setIsCreateObjectModalOpen] = useState(false);
  const [objectToEdit, setObjectToEdit] = useState<ICustomAttribute | null>(null);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { setToastAlert } = useToast();

  const { projectDetails } = useProjectDetails();

  const handleEditObject = (object: ICustomAttribute) => {
    setObjectToEdit(object);
    setIsCreateObjectModalOpen(true);
  };

  return (
    <ProjectAuthorizationWrapper
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbItem
            title={`${truncateText(projectDetails?.name ?? "Project", 32)}`}
            link={`/${workspaceSlug}/projects/${projectId}/issues`}
            linkTruncate
          />
          <BreadcrumbItem title="Control Settings" unshrinkTitle />
        </Breadcrumbs>
      }
    >
      <ObjectModal
        objectIdToEdit={objectToEdit?.id}
        isOpen={isCreateObjectModalOpen}
        onClose={() => {
          setIsCreateObjectModalOpen(false);
          setObjectToEdit(null);
        }}
      />
      <div className="p-8">
        <SettingsHeader />
        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-medium">Custom Objects</h2>
            <PrimaryButton onClick={() => setIsCreateObjectModalOpen(true)}>
              Add Object
            </PrimaryButton>
          </div>
          <div className="mt-4 border-y border-custom-border-100">
            <ObjectsList
              handleEditObject={handleEditObject}
              projectId={projectId?.toString() ?? ""}
            />
          </div>
        </div>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default ControlSettings;
