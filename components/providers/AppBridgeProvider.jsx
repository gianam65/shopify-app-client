import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Provider } from "@shopify/app-bridge-react";
import { Banner, Layout, Page } from "@shopify/polaris";

/**
 * A component to configure App Bridge.
 * @desc A thin wrapper around AppBridgeProvider that provides the following capabilities:
 *
 * 1. Ensures that navigating inside the app updates the host URL.
 * 2. Configures the App Bridge Provider, which unlocks functionality provided by the host.
 *
 * See: https://shopify.dev/apps/tools/app-bridge/getting-started/using-react
 */
export function AppBridgeProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const history = useMemo(
    () => ({
      replace: (path) => {
        navigate(path, { replace: true });
      },
    }),
    [navigate],
  );

  const routerConfig = useMemo(
    () => ({ history, location }),
    [history, location],
  );

  const [appBridgeConfig] = useState(() => {
    const host =
      new URLSearchParams(location.search).get("host") ||
      window.__SHOPIFY_DEV_HOST ||
      "YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvbmFtZ2lhLWRldmVsb3BtZW4";

    window.__SHOPIFY_DEV_HOST = host;

    return {
      host,
      apiKey: import.meta.env.VITE_API_KEY,
      forceRedirect: false,
    };
  });
  if (!import.meta.env.VITE_API_KEY || !appBridgeConfig.host) {
    const bannerProps = !import.meta.env.VITE_API_KEY
      ? {
          title: "Missing Shopify API Key",
          children: (
            <>
              Your app is running without the SHOPIFY_API_KEY environment
              variable. Please ensure that it is set when running or building
              your React app.
            </>
          ),
        }
      : {
          title: "Missing host query argument",
          children: (
            <>
              Your app can only load if the URL has a <b>host</b> argument.
              Please ensure that it is set, or access your app using the
              Partners Dashboard <b>Test your app</b> feature
            </>
          ),
        };

    return (
      <Page narrowWidth>
        <Layout>
          <Layout.Section>
            <div style={{ marginTop: "100px" }}>
              <Banner {...bannerProps} status="critical" />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Provider config={appBridgeConfig} router={routerConfig}>
      {children}
    </Provider>
  );
}
