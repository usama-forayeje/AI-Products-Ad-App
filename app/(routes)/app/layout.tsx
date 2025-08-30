import React from "react";
import DashboardProvider from "./provider";

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardProvider>{children}</DashboardProvider>;
}

export default AppLayout;
