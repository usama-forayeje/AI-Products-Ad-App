// app/components/app/app-sidebar.tsx
import * as React from "react";
import {
  Home,
  Inbox,
  MegaphoneIcon,
  Settings,
  Wallet2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../provider";
import Link from "next/link";
import { NavUser } from "./nav-user";
import Image from "next/image";

const data = [
  {
    title: "Home",
    url: "/app",
    icon: Home,
  },
  {
    title: "Creative Tools",
    url: "/app/creative-ai-tools/products-images",
    icon: Inbox,
  },
  {
    title: "My Ads",
    url: "/app/my-ads",
    icon: MegaphoneIcon,
  },
  {
    title: "Upgrade",
    url: "/app",
    icon: Wallet2Icon,
  },
  {
    title: "Settings",
    url: "/app",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path: string = usePathname();
  const { user } = useAuthContext();
  const displayName = user?.displayName;
  const photoURL = user?.photoURL;
  const email = user?.email;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/app" className="flex items-center gap-2 px-4 py-2">
          <Image
            width={32}
            height={32}
            src="/Ai-logo.png"
            alt="AI Ads Generator Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-lg font-semibold ">AI Ads Generator</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {data.map((item) => {
            const isActive = path === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <NavUser
          user={{
            name: displayName ?? "",
            email: email ?? "",
            avatar: photoURL ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
