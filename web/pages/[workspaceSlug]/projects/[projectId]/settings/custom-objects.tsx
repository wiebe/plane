import React, { useState } from "react";
import { useRouter } from "next/router";

// layouts
import { ProjectAuthorizationWrapper } from "layouts/auth-layout";
// hooks
import useProjectDetails from "hooks/use-project-details";
// components
import { SettingsSidebar } from "components/project";
import { ObjectModal, ObjectsList } from "components/custom-attributes";
// ui
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
import { PrimaryButton } from "components/ui";
// helpers
import { truncateText } from "helpers/string.helper";
// types
import type { NextPage } from "next";

const CustomObjectSettings: NextPage = () => {
  const [isCreateObjectModalOpen, setIsCreateObjectModalOpen] = useState(false);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { projectDetails } = useProjectDetails();

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
        isOpen={isCreateObjectModalOpen}
        onClose={() => setIsCreateObjectModalOpen(false)}
      />
      <div className="flex flex-row gap-2">
        <div className="w-80 py-8">
          <SettingsSidebar />
        </div>
        <section className="pr-9 py-8 w-full">
          <div className="flex items-center justify-between gap-2 py-3.5 border-b border-custom-border-200">
            <h3 className="text-xl font-medium">Custom Objects</h3>
            <PrimaryButton onClick={() => setIsCreateObjectModalOpen(true)}>
              Add Object
            </PrimaryButton>
          </div>
          <div>
            <div className="mt-4">
              <ObjectsList projectId={projectId?.toString() ?? ""} />
            </div>
          </div>
        </section>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default CustomObjectSettings;
