import { FC, ReactNode } from "react";
import dynamic from "next/dynamic";
import Router from "next/router";
import NProgress from "nprogress";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
// hooks
import { useApplication, useUser } from "hooks/store";
// constants
import { THEMES } from "constants/themes";
// layouts
import InstanceLayout from "layouts/instance-layout";
// contexts
import { ToastContextProvider } from "contexts/toast.context";
import { SWRConfig } from "swr";
// constants
import { SWR_CONFIG } from "constants/swr-config";
// dynamic imports
const StoreWrapper = dynamic(() => import("lib/wrappers/store-wrapper"), { ssr: false });
const PostHogProvider = dynamic(() => import("lib/posthog-provider"), { ssr: false });
const CrispWrapper = dynamic(() => import("lib/wrappers/crisp-wrapper"), { ssr: false });

// nprogress
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeError", NProgress.done);
Router.events.on("routeChangeComplete", NProgress.done);

export interface IAppProvider {
  children: ReactNode;
  session: any;
}

export const AppProvider: FC<IAppProvider> = observer((props) => {
  const { children, session } = props;
  // store hooks
  const {
    currentUser,
    membership: { currentProjectRole, currentWorkspaceRole },
  } = useUser();
  const {
    config: { envConfig },
  } = useApplication();

  return (
    <SessionProvider session={session}>
      <ThemeProvider themes={THEMES} defaultTheme="system">
        <ToastContextProvider>
          <InstanceLayout>
            <StoreWrapper>
              <CrispWrapper user={currentUser}>
                <PostHogProvider
                  user={currentUser}
                  workspaceRole={currentWorkspaceRole}
                  projectRole={currentProjectRole}
                  posthogAPIKey={envConfig?.posthog_api_key || null}
                  posthogHost={envConfig?.posthog_host || null}
                >
                  <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>
                </PostHogProvider>
              </CrispWrapper>
            </StoreWrapper>
          </InstanceLayout>
        </ToastContextProvider>
      </ThemeProvider>
    </SessionProvider>
  );
});
