import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useMessageActions = (selectedChat: string) => {
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/functions/v1/upload-attachment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { publicUrl } = await response.json();
      
      // Create message with image
      await handleSendMessage(undefined, publicUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (customMessage?: string, imageUrl?: string) => {
    const messageContent = customMessage || newMessage;
    
    if (!selectedChat || (!messageContent.trim() && !imageUrl)) {
      toast({
        title: "Error",
        description: "Please enter a message",
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

      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const { data: receiverProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', selectedChat)
        .single();

      if (!senderProfile || !receiverProfile) {
        toast({
          title: "Error",
          description: "Could not find user profiles",
          variant: "destructive",
        });
        return;
      }

      const messageData = {
        sender_id: user.id,
        receiver_id: selectedChat,
        content: imageUrl ? `![Image](${imageUrl})` : messageContent,
        message_type: imageUrl ? 'image' : 'text',
        sender_profile_id: senderProfile.id,
        receiver_profile_id: receiverProfile.id,
        media_url: imageUrl || null,
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });

    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji: emoji
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat] });

      toast({
        title: "Success",
        description: "Reaction added",
      });

    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive",
      });
    }
  };

  return {
    newMessage,
    setNewMessage,
    isUploading,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction,
    handleImageUpload
  };
};