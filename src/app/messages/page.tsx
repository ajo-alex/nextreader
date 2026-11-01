import { repository } from "@/lib/data/repository";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ChatInterface } from "@/components/messages/chat-interface";
import { MessageSquare, BookOpen, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const currentUser = await repository.getCurrentUser();
  const conversations = await repository.getConversations(currentUser.id);

  const selectedConv = conversations[0];
  const messages = selectedConv ? await repository.getConversationMessages(selectedConv.id) : [];

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 text-left">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-dark">
            Conversations
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Coordinate physical handovers, return meetups, and book condition questions securely.
          </p>
        </div>

        {conversations.length > 0 && selectedConv ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Conversation sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mutedGray px-2">
                Active Discussions
              </h4>
              <div className="rounded-2xl border border-surfaceBorder bg-white overflow-hidden shadow-xs divide-y divide-surfaceBorder">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-4 bg-forest-subtle/50 hover:bg-forest-subtle transition-colors cursor-pointer text-left flex gap-3 items-center"
                  >
                    <div className="h-10 w-10 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {conv.book?.title ? conv.book.title[0] : "B"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-forest-dark truncate">
                        {conv.book?.title || "Book Discussion"}
                      </h4>
                      <p className="text-xs text-mutedGray truncate mt-0.5">
                        {conv.last_message?.body || "Start coordinating meetup..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-8">
              <ChatInterface
                conversation={selectedConv}
                initialMessages={messages}
                currentUser={currentUser}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-surfaceBorder bg-white/60 p-12 text-center space-y-3">
            <MessageSquare className="h-10 w-10 text-mutedGray mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-dark">
              No conversations yet
            </h3>
            <p className="text-xs text-mutedGray max-w-sm mx-auto">
              Conversations open automatically when you request a book or when someone requests a book from your shelf.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

