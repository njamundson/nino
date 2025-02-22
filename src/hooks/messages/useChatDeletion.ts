import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useChatDeletion = (onChatDeleted: (userId: string) => void) => {
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteChat = async (currentUserId: string | undefined, otherUserId: string) => {
    if (!currentUserId) return;
    
    setIsDeletingChat(true);

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`);

      if (error) throw error;

      queryClient.removeQueries({ queryKey: ['messages', otherUserId] });
      onChatDeleted(otherUserId);

    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation",
        variant: "destructive",
      });
    } finally {
      setIsDeletingChat(false);
    }
  };

  return {
    deleteChat,
    isDeletingChat
  };
};