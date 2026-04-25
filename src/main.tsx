import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CustomProvider } from "rsuite";

import "rsuite/dist/rsuite.css";

createRoot(document.getElementById("root")!).render(
  <CustomProvider theme="dark">
    <App />
  </CustomProvider>,
);
