"use client"

import { MessageSquare } from "lucide-react"

export default function Chats() {
  // This is a placeholder component for the Chats page
  // You would implement your chat functionality here

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Chat History</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        Your conversations will appear here. Start a new chat to begin.
      </p>
    </div>
  )
}
