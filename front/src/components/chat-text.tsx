import * as React from "react"
import { Textarea } from "@/components/ui/textarea"

interface ChatTextProps {
  onKeyDown?: (e: React.KeyboardEvent) => void
}

const ChatText = React.forwardRef<HTMLTextAreaElement, ChatTextProps>(
  ({ onKeyDown }, ref) => {
    return (
      <Textarea
        ref={ref}
        onKeyDown={onKeyDown}
        placeholder="Type a message..."
        className="min-h-[60px] max-h-[25vh] resize-y bg-transparent"
      />
    )
  }
)

ChatText.displayName = "ChatText"

export default ChatText
