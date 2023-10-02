import { useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { SingleObject } from "components/custom-attributes";
// ui
import { EmptyState, Loader } from "components/ui";
// assets
import emptyCustomObjects from "public/empty-state/custom-objects.svg";

type Props = {
  projectId: string;
};

export const ObjectsList: React.FC<Props> = observer(({ projectId }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes } = useMobxStore();

  useEffect(() => {
    if (!workspaceSlug) return;

    if (!customAttributes.objects)
      customAttributes.fetchObjects(workspaceSlug.toString(), projectId);
  }, [customAttributes, projectId, workspaceSlug]);

  return (
    <div className="divide-y divide-custom-border-100">
      {customAttributes.objects ? (
        customAttributes.objects.length > 0 ? (
          customAttributes.objects.map((object) => <SingleObject key={object.id} object={object} />)
        ) : (
          <div className="bg-custom-background-90 border border-custom-border-100 rounded max-w-3xl mt-10 mx-auto">
            <EmptyState
              title="No custom objects yet"
              description="You can think of Pages as an AI-powered notepad."
              image={emptyCustomObjects}
              isFullScreen={false}
            />
          </div>
        )
      ) : (
        <Loader className="space-y-4">
          <Loader.Item height="60px" />
          <Loader.Item height="60px" />
          <Loader.Item height="60px" />
        </Loader>
      )}
    </div>
  );
});
