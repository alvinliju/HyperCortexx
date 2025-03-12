import { Brain } from "lucide-react"

function SideBarChat() {
  return (
    <div className="flex items-center gap-2 border p-2 rounded-md hover:bg-muted/40 hover:text-primary hover:cursor-pointer">
        <Brain className="size-4"/>
        <p className="text-sm font-semibold">Chat</p>
    </div>
  )
}

export default SideBarChat