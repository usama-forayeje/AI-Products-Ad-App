"use client";

import DashboardProvider from "./provider";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardProvider>{children}</DashboardProvider>;
}