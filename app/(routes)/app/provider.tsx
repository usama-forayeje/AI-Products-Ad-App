"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthContext } from "@/app/provider";
import { AppSidebar } from "@/app/_components/AppSidebar";
import AppHeader from "@/app/_components/AppHeader";

function DashboardProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user?.user && user.user) return router.replace("/");

    // user?.user && checkUser()
  }, [user, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <AppHeader />
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardProvider;
