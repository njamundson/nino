import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Send, Search, MoreHorizontal, Plus, Image, Mic, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_profile?: {
    first_name: string;
    last_name: string;
  };
  receiver_profile?: {
    first_name: string;
    last_name: string;
  };
}

interface Creator {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
  };
}

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(
            first_name,
            last_name
          ),
          receiver_profile:profiles!messages_receiver_id_fkey(
            first_name,
            last_name
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const { data: creators } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creators")
        .select(`
          id,
          profile:profiles(
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      return data as Creator[];
    },
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      receiver_id: selectedChat,
      read: false,
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    refetch();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "Coming soon",
      description: "File upload feature will be available soon",
    });
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    toast({
      title: "Coming soon",
      description: "Voice recording feature will be available soon",
    });
  };

  const startNewChat = (creatorId: string) => {
    setSelectedChat(creatorId);
  };

  const filteredMessages = messages?.filter((message) => {
    const senderName = `${message.sender_profile?.first_name} ${message.sender_profile?.last_name}`.toLowerCase();
    const receiverName = `${message.receiver_profile?.first_name} ${message.receiver_profile?.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return senderName.includes(query) || receiverName.includes(query) || message.content.toLowerCase().includes(query);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      <div className="flex h-full gap-6">
        {/* Conversations List */}
        <Card className="w-96 bg-white/80 backdrop-blur-xl border-0 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages"
                className="pl-10 bg-gray-50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                >
                  <Plus className="w-5 h-5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {creators?.map((creator) => (
                  <DropdownMenuItem
                    key={creator.id}
                    onClick={() => startNewChat(creator.id)}
                    className="flex items-center gap-2 p-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                        {creator.profile?.first_name?.[0]}
                        {creator.profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {creator.profile?.first_name} {creator.profile?.last_name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-2">
              {filteredMessages?.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedChat === chat.id
                      ? "bg-nino-primary/10"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                        {chat.sender_profile?.first_name?.[0]}
                        {chat.sender_profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-nino-text truncate">
                          {chat.sender_profile?.first_name} {chat.sender_profile?.last_name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(chat.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
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
        <Card className="flex-1 bg-white/80 backdrop-blur-xl border-0 shadow-sm flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center bg-white/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                      {messages?.find(m => m.id === selectedChat)?.sender_profile?.first_name?.[0]}
                      {messages?.find(m => m.id === selectedChat)?.sender_profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-nino-text">
                      {messages?.find(m => m.id === selectedChat)?.sender_profile?.first_name}{" "}
                      {messages?.find(m => m.id === selectedChat)?.sender_profile?.last_name}
                    </h3>
                    <p className="text-xs text-gray-500">Active now</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </Button>
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
                          className={`max-w-[70%] p-4 rounded-2xl animate-fade-in ${
                            message.sender_id === selectedChat
                              ? "bg-gray-100 text-nino-text"
                              : "bg-nino-primary text-white"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-white/50">
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-gray-500 ${isRecording ? 'bg-red-50' : ''}`}
                    onClick={handleVoiceRecord}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
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
                    className="bg-nino-primary hover:bg-nino-primary/90 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;