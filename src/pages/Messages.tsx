import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import ChatContainer from "@/components/messages/ChatContainer";
import ChatList from "@/components/messages/ChatList";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/message";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get("userId")
  );
  const [selectedFirstName, setSelectedFirstName] = useState<string | null>(null);
  const [selectedLastName, setSelectedLastName] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    data: messages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage: sendMessage
  } = useMessages(selectedUserId || '');

  const handleSelectChat = (
    userId: string, 
    firstName: string, 
    lastName: string, 
    profileImage: string | null
  ) => {
    setSelectedUserId(userId);
    setSelectedFirstName(firstName);
    setSelectedLastName(lastName);
    setSelectedProfileImage(profileImage);
  };

  const handleSendMessage = async () => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a recipient",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }

      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedUserId,
        content: newMessage,
        message_type: 'text'
      });

      setNewMessage('');
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <ChatList 
            onSelectChat={handleSelectChat}
            selectedUserId={selectedUserId}
          />
        </div>
        
        <div className="md:col-span-2 h-full">
          <ChatContainer
            selectedChat={selectedUserId}
            selectedFirstName={selectedFirstName}
            selectedLastName={selectedLastName}
            selectedProfileImage={selectedProfileImage}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            messages={messages as Message[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;