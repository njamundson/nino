import React, { useRef, useState } from 'react';
import { Send, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BrandChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  selectedChat: string | null;
  editingMessage?: any;
  setEditingMessage?: (message: any) => void;
}

const BrandChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  selectedChat,
  editingMessage,
  setEditingMessage,
}: BrandChatInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWithImage();
    }
  };

  const handleSendWithImage = () => {
    if (uploadedImageUrl) {
      // Only append the image URL when actually sending
      const messageToSend = `${newMessage ? newMessage + '\n' : ''}![Image](${uploadedImageUrl})`;
      setNewMessage(messageToSend);
      setImagePreview(null);
      setUploadedImageUrl(null);
    }
    handleSendMessage();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Only image files are allowed",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Sanitize filename
      const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, '');
      const fileExt = sanitizedName.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName);

      setUploadedImageUrl(publicUrl);

      toast({
        title: "Success",
        description: "Image ready to send",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setImagePreview(null);
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-3 bg-white/80 backdrop-blur-xl border-t border-gray-100">
      <div className="relative max-w-4xl mx-auto">
        <div className="relative">
          {imagePreview && (
            <div className="absolute bottom-full mb-2 left-0">
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <img src={imagePreview} alt="Preview" className="max-w-[200px] max-h-[200px] object-cover rounded-2xl" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setUploadedImageUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message"
            className="min-h-[40px] max-h-[200px] pr-24 resize-none bg-white/60 backdrop-blur-sm rounded-full border-gray-200 shadow-sm transition-all duration-200 focus:shadow-md focus:bg-white focus:border-gray-300 hover:border-gray-300 py-2.5 px-4 text-[15px] leading-5"
            rows={1}
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
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
              className="h-7 w-7 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-gray-300 border-t-gray-600" />
              ) : (
                <Image className="h-3.5 w-3.5 text-gray-600" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={handleSendWithImage}
            >
              <Send className="h-3.5 w-3.5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandChatInput;