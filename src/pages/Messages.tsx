import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Send, Search, MoreHorizontal, Plus, Image, Mic, Paperclip, Edit2, Info } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

    // Handle file upload logic here
    toast({
      title: "Coming soon",
      description: "File upload feature will be available soon",
    });
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Handle voice recording logic here
    toast({
      title: "Coming soon",
      description: "Voice recording feature will be available soon",
    });
  };

  const handleNewMessage = () => {
    // Handle new message creation logic here
    toast({
      title: "Coming soon",
      description: "New message feature will be available soon",
    });
  };

  const filteredMessages = messages?.filter((message) => {
    const senderName = `${message.sender_profile?.first_name} ${message.sender_profile?.last_name}`.toLowerCase();
    const receiverName = `${message.receiver_profile?.first_name} ${message.receiver_profile?.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return senderName.includes(query) || receiverName.includes(query) || message.content.toLowerCase().includes(query);
  });

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto h-full p-4">
        <Card className="h-full bg-white/80 backdrop-blur-xl border-0 shadow-lg rounded-2xl overflow-hidden flex">
          {/* Sidebar */}
          <div className="w-[320px] border-r border-gray-100 flex flex-col">
            {/* Window Controls */}
            <div className="p-3 flex items-center gap-2 border-b bg-[#f5f5f7]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
            </div>
            
            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-[#f5f5f7] border-0 rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 mb-2 hover:bg-[#f5f5f7] rounded-lg"
                  onClick={handleNewMessage}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  <span>New Message</span>
                </Button>
                
                {filteredMessages?.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedChat === chat.id
                        ? "bg-blue-50"
                        : "hover:bg-[#f5f5f7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {chat.sender_profile?.first_name?.[0]}
                          {chat.sender_profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-900 truncate">
                            {chat.sender_profile?.first_name} {chat.sender_profile?.last_name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDate(chat.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {chat.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b flex justify-between items-center bg-[#f5f5f7]">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {messages?.find(m => m.id === selectedChat)?.sender_profile?.first_name?.[0]}
                        {messages?.find(m => m.id === selectedChat)?.sender_profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {messages?.find(m => m.id === selectedChat)?.sender_profile?.first_name}{" "}
                        {messages?.find(m => m.id === selectedChat)?.sender_profile?.last_name}
                      </h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Info className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>

                {/* Messages */}
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
                            className={`max-w-[70%] px-4 py-2 rounded-2xl animate-fade-in ${
                              message.sender_id === selectedChat
                                ? "bg-[#f5f5f7] text-gray-900"
                                : "bg-blue-500 text-white"
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

                {/* Input Area */}
                <div className="p-3 bg-[#f5f5f7]">
                  <div className="flex gap-2 items-center bg-white p-1 rounded-full border border-gray-200">
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
                      className="text-gray-500 rounded-full"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="iMessage"
                      className="border-0 focus-visible:ring-0 bg-transparent"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-gray-500 rounded-full ${isRecording ? 'bg-red-50' : ''}`}
                      onClick={handleVoiceRecord}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;