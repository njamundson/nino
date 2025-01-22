import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications, error: notificationsError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First, get unread messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
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
        .eq('receiver_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return [];
      }

      // Then, get unread applications (proposals)
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          creator:creators (
            profile:profiles (
              first_name,
              last_name
            )
          ),
          opportunity:opportunities (
            title
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        return [];
      }

      // Transform messages and applications into a unified notification format
      const messageNotifications = (messages || []).map(message => ({
        id: message.id,
        type: 'message',
        content: `New message from ${message.sender_profile.first_name} ${message.sender_profile.last_name}`,
        created_at: message.created_at,
        read: message.read,
        action_url: '/brand/messages'
      }));

      const applicationNotifications = (applications || []).map(application => ({
        id: application.id,
        type: 'application',
        content: `New proposal from ${application.creator.profile.first_name} ${application.creator.profile.last_name} for "${application.opportunity.title}"`,
        created_at: application.created_at,
        read: false,
        action_url: '/brand/proposals'
      }));

      // Combine and sort all notifications by date
      return [...messageNotifications, ...applicationNotifications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5); // Limit to 5 most recent notifications
    },
    retry: 1,
  });

  const dismissNotification = useMutation({
    mutationFn: async (notification: { id: string, type: string }) => {
      if (notification.type === 'message') {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', notification.id);

        if (error) throw error;
      } else if (notification.type === 'application') {
        const { error } = await supabase
          .from('applications')
          .update({ status: 'viewed' })
          .eq('id', notification.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification dismissed",
        description: "The notification has been marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to dismiss notification",
        variant: "destructive",
      });
    },
  });

  return {
    isOpen,
    setIsOpen,
    notifications,
    notificationsError,
    dismissNotification,
    navigate
  };
};