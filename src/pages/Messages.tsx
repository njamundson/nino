import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      receiver_id: selectedChat,
      read: false,
    });

    if (!error) {
      setNewMessage("");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      <PageHeader
        title="Messages"
        description="Chat with brands and manage your conversations"
      />
      
      <div className="flex h-full gap-6 mt-8">
        {/* Conversations List */}
        <Card className="w-80 bg-white/80 backdrop-blur-xl border-0 shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-nino-text">Messages</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-2 space-y-1">
              {messages?.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedChat === chat.id
                      ? "bg-nino-primary/10"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-nino-primary/20 flex items-center justify-center text-nino-primary font-medium">
                      {chat.sender_id.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-nino-text">
                        User {chat.sender_id.substring(0, 8)}
                      </p>
                      <p className="text-xs text-nino-gray truncate">
                        {chat.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 bg-white/80 backdrop-blur-xl border-0 shadow-sm flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-medium text-nino-text">
                  Chat with User {selectedChat.substring(0, 8)}
                </h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages
                    ?.filter(
                      (m) =>
                        m.sender_id === selectedChat ||
                        m.receiver_id === selectedChat
                    )
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === selectedChat
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            message.sender_id === selectedChat
                              ? "bg-gray-100 text-nino-text"
                              : "bg-nino-primary text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-nino-primary hover:bg-nino-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-nino-gray">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
