"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  Search,
  File,
  Bookmark,
  MessageSquare,
  Settings,
  User,
  Globe,
  Calendar,
  FileText,
  Video,
  LinkIcon,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

type SearchResult = {
  id: string
  title: string
  description?: string
  category: "saved" | "chats" | "settings" | "files" | "web"
  icon: React.ReactNode
  url: string
}

export function SpotlightSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sample data - in a real app, this would come from your database or API
  const sampleData: SearchResult[] = [
    {
      id: "1",
      title: "Role-based Access Control",
      description: "Best practices for implementing RBAC",
      category: "saved",
      icon: <FileText className="h-5 w-5" />,
      url: "https://www.cerbos.dev/blog/role-based-access-control-best-practices",
    },
    {
      id: "2",
      title: "Never Gonna Give You Up",
      description: "Music video by Rick Astley",
      category: "saved",
      icon: <Video className="h-5 w-5" />,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: "3",
      title: "Project Settings",
      description: "Configure your project settings",
      category: "settings",
      icon: <Settings className="h-5 w-5" />,
      url: "/dashboard/settings",
    },
    {
      id: "4",
      title: "Chat with Support",
      description: "Get help from our support team",
      category: "chats",
      icon: <MessageSquare className="h-5 w-5" />,
      url: "/dashboard/chats/support",
    },
    {
      id: "5",
      title: "User Profile",
      description: "View and edit your profile",
      category: "settings",
      icon: <User className="h-5 w-5" />,
      url: "/dashboard/profile",
    },
    {
      id: "6",
      title: "HyperCortex Documentation",
      description: "Learn how to use HyperCortex",
      category: "web",
      icon: <Globe className="h-5 w-5" />,
      url: "/docs",
    },
    {
      id: "7",
      title: "Calendar Events",
      description: "View upcoming events",
      category: "files",
      icon: <Calendar className="h-5 w-5" />,
      url: "/dashboard/calendar",
    },
    {
      id: "8",
      title: "Twitter Post",
      description: "Saved tweet from @e3he0",
      category: "saved",
      icon: <LinkIcon className="h-5 w-5" />,
      url: "https://x.com/e3he0/status/1899846731065663867",
    },
  ]

  // Filter results based on search query
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const filtered = sampleData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())),
    )

    setResults(filtered)
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger for Cmd+K or Ctrl+K, ignore other keyboard events
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    // Don't attach listener if component is not mounted
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Handle keyboard navigation in results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      // Navigate down
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      }

      // Navigate up
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      }

      // Select item with Enter
      if (e.key === "Enter" && results.length > 0) {
        e.preventDefault()
        window.location.href = results[selectedIndex].url
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Group results by category
  const groupedResults = React.useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {}

    results.forEach((result) => {
      if (!grouped[result.category]) {
        grouped[result.category] = []
      }
      grouped[result.category].push(result)
    })

    return grouped
  }, [results])

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "saved":
        return "Saved Items"
      case "chats":
        return "Chats"
      case "settings":
        return "Settings"
      case "files":
        return "Files"
      case "web":
        return "Web"
      default:
        return category
    }
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-background hover:bg-muted transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Spotlight search modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => setIsOpen(false)}
            />

            {/* Search modal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-[600px] -translate-x-1/2 overflow-hidden rounded-xl bg-background/80 shadow-2xl backdrop-blur-xl"
            >
              {/* Search input */}
              <div className="flex items-center border-b px-4 py-3">
                <Search className="mr-2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for anything..."
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                  autoComplete="off"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="rounded-full p-1 hover:bg-muted">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Search results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 && query && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <File className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">No results found for "{query}"</p>
                  </div>
                )}

                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <div className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                      {getCategoryLabel(category)}
                    </div>
                    <div className="space-y-1">
                      {items.map((item, index) => {
                        // Calculate the absolute index in the flattened results array
                        const absoluteIndex = results.findIndex((r) => r.id === item.id)

                        return (
                          <a
                            key={item.id}
                            href={item.url}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              absoluteIndex === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                            )}
                            onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full",
                                absoluteIndex === selectedIndex
                                  ? "bg-primary-foreground/20 text-primary-foreground"
                                  : "bg-muted text-foreground",
                              )}
                            >
                              {item.icon}
                            </div>
                            <div className="flex-1 truncate">
                              <div className="font-medium">{item.title}</div>
                              {item.description && (
                                <div
                                  className={cn(
                                    "truncate text-xs",
                                    absoluteIndex === selectedIndex
                                      ? "text-primary-foreground/80"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Quick actions when no query */}
                {!query && (
                  <div className="space-y-4 p-2">
                    <div className="mb-2 px-3 text-xs font-medium text-muted-foreground">Recent Searches</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 truncate">
                          <div className="font-medium">Role-based Access Control</div>
                          <div className="truncate text-xs text-muted-foreground">
                            Best practices for implementing RBAC
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <Settings className="h-5 w-5" />
                        </div>
                        <div className="flex-1 truncate">
                          <div className="font-medium">Project Settings</div>
                          <div className="truncate text-xs text-muted-foreground">Configure your project settings</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 px-3 text-xs font-medium text-muted-foreground">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <Bookmark className="h-4 w-4" />
                        <span>View Saved Items</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <MessageSquare className="h-4 w-4" />
                        <span>New Chat</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <Settings className="h-4 w-4" />
                        <span>App Settings</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Keyboard shortcuts */}
              <div className="border-t px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>↑↓</span>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>↵</span>
                    <span>to select</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Esc</span>
                    <span>to close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
