import React, { useRef, useState } from 'react';
import { Send, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording?: boolean;
  setIsRecording?: (isRecording: boolean) => void;
  selectedChat: string;
  editingMessage?: any;
  setEditingMessage?: (message: any) => void;
}

const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedChat,
  editingMessage,
  setEditingMessage,
}: ChatInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // First get the creator's profile to check permissions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('profile_image_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        throw new Error('Failed to verify permissions');
      }

      // Upload the file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName);

      // Add the image URL to the message
      setNewMessage(prevMessage => {
        const prefix = prevMessage ? `${prevMessage}\n` : '';
        return `${prefix}![Image](${publicUrl})`;
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-4 border-t bg-white/50 backdrop-blur-xl">
      <div className="relative">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="pr-24 resize-none bg-white"
          rows={1}
        />
        <div className="absolute right-2 bottom-1.5 flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Image className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;