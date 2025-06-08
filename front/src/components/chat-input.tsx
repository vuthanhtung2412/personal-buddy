import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Send, Paperclip } from "lucide-react"
import { AttachableBadge } from "@/components/attachable-badge"
import ChatText from "@/components/chat-text"
import AttachableSelector from "@/components/attachable-selector"
import { Attachable } from "@/types/attachable"
import { useAttachables } from "@/hooks/useAttachables"

const attachables: Attachable[] = [
  {
    type: "resource" as const,
    id: "Resource1",
    subtype: "github"
  },
  {
    type: "resource" as const,
    id: "Resource2",
    subtype: "google_doc"
  },
  {
    type: "resource" as const,
    id: "Resource3",
    subtype: "slack"
  },
  {
    type: "workflow" as const,
    id: "Workflow1"
  },
  {
    type: "workflow" as const,
    id: "Workflow2"
  }
];

interface ChatInputProps {
  onSubmit: (content: string) => void
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const {
    availableAttachables,
    selectedAttachables,
    selectAttachable,
    unselectAttachable
  } = useAttachables(attachables)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const content = textAreaRef.current?.value.trim()
    if (content) {
      onSubmit(content)
      if (textAreaRef.current) {
        textAreaRef.current.value = ""
        textAreaRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center pb-4 w-full">
      <Card className="w-4/5 gap-1.5 py-2">
        <CardHeader
          className="gap-0 px-2"
        >
          <div className="flex space-x-2">
            {selectedAttachables.map((attachable) => (
              <AttachableBadge
                key={`${attachable.type}-${attachable.id}`}
                {...attachable}
                onRemove={() => {
                  unselectAttachable(attachable.type, attachable.id)
                }}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent
          className="px-2"
        >
          <ChatText ref={textAreaRef} onKeyDown={handleKeyDown} />
        </CardContent>

        <CardFooter className="flex justify-between px-2">
          <div className="flex space-x-2">
            <input type="file" ref={fileInputRef} className="hidden" multiple />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 rounded-full"
            >
              <Paperclip size={18} />
            </Button>
            <AttachableSelector
              type={"resource" as const}
              items={availableAttachables.filter(
                (a) => a.type === "resource"
              )}
              selectAttachable={selectAttachable}
              hasAvailableAttachables={availableAttachables.some(
                (a) => a.type === "resource"
              )}
            />
            <AttachableSelector
              type={"workflow" as const}
              items={availableAttachables.filter(
                (a) => a.type === "workflow"
              )}
              selectAttachable={selectAttachable}
              hasAvailableAttachables={availableAttachables.some(
                (a) => a.type === "workflow"
              )}
            />
          </div>
          <Button type="submit" size="icon" className="h-8 w-8 rounded-full">
            <Send size={16} />
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
