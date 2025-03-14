"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"

// Reduced icon imports - only keeping what's necessary
import { Globe, Search, Bookmark, Settings, LogOut } from "lucide-react"

// Reduced UI component imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// Custom hooks
import { useAuth } from "@/hooks/useAuth"
import SavedCard from "../components/savedCard"

// Sample data for saved links
const savedLinks = [
  "https://www.cerbos.dev/blog/role-based-access-control-best-practices?ref=dailydev",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=vf7bI5nZyi8",
  "https://x.com/e3he0/status/1899846731065663867",
]

function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Authentication hook to protect the dashboard
  useAuth()

  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}

// Simplified dashboard content component
function DashboardContent({ children }: { children: React.ReactNode }) {
  // State for simple search
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Simplified Sidebar */}
      <Sidebar variant="floating" collapsible="icon">
        {/* Logo */}
        <SidebarHeader className="flex flex-col gap-0 px-3 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 px-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">
              Hyper<span className="text-primary">Cortex</span>
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {/* Simple Search */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="px-3 py-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Minimal Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard">
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Saved Items</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Simplified Footer */}
        <SidebarFooter className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">
                  User
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Simplified Main Content */}
      <main className="flex-1 flex flex-col w-full">
        {/* Simplified Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Saved Items</h1>
          </div>
        </header>

        {/* Simplified Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4">
            {/* Simple Grid of Saved Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedLinks.map((link, index) => (
                <SavedCard key={index} url={link} />
              ))}
            </div>

            {/* Children components */}
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout