"use client"

import { ChatInput } from "@/components/chat-input"
import { MessageCard } from "@/components/message-card"
import { useState } from "react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleNewMessage = (content: string) => {
    setMessages(prev => [...prev, { role: "user", content }])
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex-col overflow-y-auto p-4 space-y-4 flex items-center">
        {messages.map((msg, i) => (
          <MessageCard
            key={i}
            role={msg.role}
            content={msg.content}
          />
        ))}
      </div>
      <ChatInput onSubmit={handleNewMessage} />
    </div>
  )
}
