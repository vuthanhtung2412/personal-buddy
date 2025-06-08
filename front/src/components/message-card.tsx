import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import type { Message } from "@ai-sdk/react"

export function MessageCard({
  role,
  content,
}: Pick<Message, "role" | "content">) {
  return (
    <Card className={`w-4/5 gap-0 py-3 
      ${role === 'assistant' ? 'border-none shadow-none' : ''}`}>
      <CardHeader className="gt-0 font-bold">
        {role.toUpperCase()}
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  )
}
