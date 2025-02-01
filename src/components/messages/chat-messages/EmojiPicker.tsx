import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  position: "left" | "right";
}

const emojis = ["👍", "❤️", "😊", "🎉", "👏", "🔥"];

export const EmojiPicker = ({ onEmojiSelect, position }: EmojiPickerProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-full mb-2 flex gap-1 rounded-lg bg-white p-2 shadow-lg",
        position === "left" ? "right-0" : "left-0"
      )}
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className="hover:bg-gray-100 rounded p-1 transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};