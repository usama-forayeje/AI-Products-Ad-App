// app/components/app/app-sidebar.tsx
import * as React from "react";
import {
  ChevronRight,
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
import { SearchForm } from "./search-form";
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
    url: "/app",
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
          {/* Replace this with your actual logo component or image */}
          <Image
            width={32}
            height={32}
            src="/your-logo.svg"
            alt="AI Ads Generator Logo"
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold">AI Ads Generator</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {data.map((item) => {
            const isActive = path === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`
                    w-full text-left py-3 px-4 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold shadow-md"
                        : "hover:bg-accent hover:text-accent-foreground text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-base">{item.title}</span>
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
