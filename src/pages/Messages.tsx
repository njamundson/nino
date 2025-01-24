import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import ChatContainer from "@/components/messages/ChatContainer";
import ChatList from "@/components/messages/ChatList";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/message";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get("userId")
  );
  const [selectedFirstName, setSelectedFirstName] = useState<string | null>(null);
  const [selectedLastName, setSelectedLastName] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const {
    data: messages,
    setMessages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
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
  };

  const handleSendMessage = async () => {
    if (!selectedUserId || !newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter a message",
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

      // Create optimistic message
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        sender_id: user.id,
        receiver_id: selectedUserId,
        content: newMessage,
        message_type: 'text',
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        media_url: null,
        media_type: null,
        sender_profile_id: null,
        receiver_profile_id: null,
        profiles: {
          first_name: '',
          last_name: ''
        }
      };

      // Add optimistic message to the UI immediately
      setMessages(prev => [...(prev || []), optimisticMessage]);
      
      // Clear input
      setNewMessage('');

      // Send to server
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedUserId,
        content: newMessage,
        message_type: 'text'
      });

      if (error) {
        // Remove optimistic message if there was an error
        setMessages(prev => prev?.filter(msg => msg.id !== optimisticMessage.id));
        throw error;
      }

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
    <div>
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
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
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            messages={messages as Message[]}
            currentUserId={user?.id}
            onMobileBack={isMobile ? () => setSelectedUserId(null) : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;