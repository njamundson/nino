import { Message } from "@/types/message";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
}

const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  const isImage = message.content.startsWith('![Image]') || message.content.includes('supabase.co/storage');

  const getImageUrl = (content: string) => {
    if (content.startsWith('![Image]')) {
      return content.match(/\((.*?)\)/)?.[1] || '';
    }
    return content;
  };

  return (
    <div
      className={cn(
        "relative flex items-end gap-2 w-full",
        !isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative rounded-[20px] px-4 py-2 max-w-[85%]",
          !isCurrentUser
            ? "bg-nino-primary text-white"
            : "bg-gray-100 text-gray-900"
        )}
      >
        {isImage ? (
          <img 
            src={getImageUrl(message.content)} 
            alt="Shared image"
            className="max-w-sm rounded-[20px]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 h-2 w-2",
            !isCurrentUser
              ? "-right-1 -translate-y-1/2 rotate-45 bg-nino-primary"
              : "-left-1 -translate-y-1/2 rotate-45 bg-gray-100"
          )}
        />
      </div>
    </div>
  );
};

export default MessageBubble;