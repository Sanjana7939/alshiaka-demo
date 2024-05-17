import React from "react";
import { AppProvider } from "../context/app-context";

export const Providers = ({ children }) => {
  return (
    <AppProvider>
      {/* <ToastProvider value={[]}> */}
      {/* <ClassroomProvider> */}
      {/* <PluginProvider plugins={PLUGINS} layouts={LAYOUTS}> */}
      {children}
      {/* </ToastProvider> */}
    </AppProvider>
  );
};
