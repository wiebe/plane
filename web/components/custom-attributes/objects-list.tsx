import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import useSWR from "swr";

// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// components
import { SingleObject } from "components/custom-attributes";
// ui
import { EmptyState, Loader } from "components/ui";
// assets
import emptyCustomObjects from "public/empty-state/custom-objects.svg";
// fetch-keys
import { CUSTOM_OBJECTS_LIST } from "constants/fetch-keys";

type Props = {
  projectId: string;
};

export const ObjectsList: React.FC<Props> = observer(({ projectId }) => {
  const router = useRouter();
  const { workspaceSlug } = router.query;

  const { customAttributes: customAttributesStore } = useMobxStore();

  useSWR(
    workspaceSlug && projectId ? CUSTOM_OBJECTS_LIST(projectId.toString()) : null,
    workspaceSlug && projectId
      ? () => customAttributesStore.fetchObjects(workspaceSlug.toString(), projectId.toString())
      : null
  );

  return (
    <div className="divide-y divide-custom-border-100">
      {customAttributesStore.objects ? (
        customAttributesStore.objects.length > 0 ? (
          customAttributesStore.objects.map((object) => (
            <SingleObject key={object.id} object={object} />
          ))
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
