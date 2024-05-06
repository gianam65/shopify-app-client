import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";

import { AppBridgeProvider, PolarisProvider } from "./components";

export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <Routes pages={pages} />
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
