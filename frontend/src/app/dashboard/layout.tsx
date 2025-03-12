"use client";

import Link from "next/link";
import SideBarItems from "../components/sideBarItems";
import SideBarSearch from "../components/sideBarSearch";
import SideBarChat from "../components/sideBarChat";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SavedCard from "../components/savedCard";
function DashboardLayout({ children }: { children: React.ReactNode }) {
    useAuth();

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex flex-col max-h-screen w-full gap-2">
            <div className="h-14 flex items-center border-b px-4 lg:h-[60px lg:px-6">
              <Link href="/dashboard">
                <p className="text-2xl font-bold">
                  Hyper<span className="text-">Cortex</span>
                </p>
              </Link>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <SideBarSearch />
              <SideBarChat />
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <SideBarItems />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px lg:px-6]">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"outline"} size="icon" className="md:hidden">
                  <Sidebar className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-2 py-12 px-4">
                  <div className="flex flex-col gap-4">
                    <SideBarSearch />
                    <SideBarChat />
                  </div>
                  <div className="flex-1">
                  <SideBarItems />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 ">
            <SavedCard/>
          </main>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
