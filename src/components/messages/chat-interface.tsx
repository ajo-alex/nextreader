"use client";

import { useState, useTransition } from "react";
import { Send, User, BookOpen } from "lucide-react";
import { Message, Conversation, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "@/actions";
import { formatRelativeTime } from "@/lib/utils";

interface ChatInterfaceProps {
  conversation: Conversation;
  initialMessages: Message[];
  currentUser: Profile;
}

export function ChatInterface({
  conversation,
  initialMessages,
  currentUser,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputBody, setInputBody] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBody.trim()) return;

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversation.id,
      sender_id: currentUser.id,
      body: inputBody.trim(),
      created_at: new Date().toISOString(),
      sender: currentUser,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const bodyToSend = inputBody.trim();
    setInputBody("");

    startTransition(async () => {
      const res = await sendMessageAction(conversation.id, bodyToSend);
      if (res.success && res.data) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? (res.data as Message) : m))
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-[550px] rounded-3xl border border-surfaceBorder bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-surfaceBorder bg-cream/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">
            {conversation.book?.title ? conversation.book.title[0] : "B"}
          </div>
          <div className="text-left">
            <h3 className="font-serif font-bold text-sm text-forest-dark line-clamp-1">
              {conversation.book?.title || "Book Discussion"}
            </h3>
            <p className="text-[11px] text-mutedGray">
              Coordinating handover & return
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F2]/40 text-left">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-mutedGray mb-0.5 px-1">
                <span>{msg.sender?.display_name || (isMe ? "You" : "Reader")}</span>
                <span>·</span>
                <span>{formatRelativeTime(msg.created_at)}</span>
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                  isMe
                    ? "bg-forest text-white rounded-br-xs"
                    : "bg-white text-charcoal border border-surfaceBorder rounded-bl-xs"
                }`}
              >
                {msg.body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-surfaceBorder bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputBody}
          onChange={(e) => setInputBody(e.target.value)}
          placeholder="Type a message to coordinate meetup or return..."
          className="flex-1 text-xs text-charcoal px-3 py-2.5 rounded-xl border border-surfaceBorder bg-cream/30 focus:outline-none focus:ring-1 focus:ring-forest focus:bg-white"
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          disabled={isPending || !inputBody.trim()}
          className="h-9 px-4 gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Send</span>
        </Button>
      </form>
    </div>
  );
}
