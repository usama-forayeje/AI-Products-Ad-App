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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "./ProfileAvatar";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../provider";
import { SearchForm } from "./search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { NavUser } from "./nav-user";

const data = [
  {
    title: "Home",
    url: "/app",
    icon: Home,
  },
  {
    title: "Creative Tools",
    url: "/creative-tools",
    icon: Inbox,
  },
  {
    title: "My Ads",
    url: "/my-ads",
    icon: MegaphoneIcon,
  },
  {
    title: "Upgrade",
    url: "/upgrade",
    icon: Wallet2Icon,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path: string = usePathname();
  const { user } = useAuthContext();
  const displayName = user?.displayName;
  const photoURL = user?.photoURL;
  const email = user?.email;
  console.log(displayName, photoURL, email);
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        /> */}
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={path === item.url}>
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
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
        {/* {!user ? (
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        ) : (
          <div className="flex gap-3 items-center justify-center w-full">
            <div className="flex gap-2 items-center justify-start border rounded-lg w-full bg-zinc-900">
              <ProfileAvatar />
              <h2>{user?.displayName}</h2>
            </div>
          </div>
        )} */}
      </SidebarFooter>
    </Sidebar>
  );
}
 
        
     