import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

export const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isRecording,
  setIsRecording,
}: ChatInputProps) => {
  const { toast } = useToast();

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

  return (
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
          className="bg-white rounded-full"
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
  );
};