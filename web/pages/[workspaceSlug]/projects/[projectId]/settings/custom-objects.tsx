import React, { useState } from "react";

import { useRouter } from "next/router";

// layouts
import { ProjectAuthorizationWrapper } from "layouts/auth-layout";
// hooks
import useToast from "hooks/use-toast";
import useProjectDetails from "hooks/use-project-details";
// components
import { SettingsHeader } from "components/project";
// ui
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
import { PrimaryButton } from "components/ui";
// icons
import { TableProperties } from "lucide-react";
// types
import type { NextPage } from "next";
// helpers
import { truncateText } from "helpers/string.helper";
import { ObjectModal } from "components/custom-attributes";

const ControlSettings: NextPage = () => {
  const [isCreateObjectModalOpen, setIsCreateObjectModalOpen] = useState(false);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { setToastAlert } = useToast();

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
            <div className="space-y-4 divide-y divide-custom-border-100">
              {/* TODO: Map over objects */}
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="bg-custom-background-80 h-10 w-10 grid place-items-center rounded">
                    <TableProperties size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Title</h5>
                    <p className="text-custom-text-300 text-xs">Description of 100 chars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default ControlSettings;
