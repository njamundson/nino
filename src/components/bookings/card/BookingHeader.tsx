import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface BookingHeaderProps {
  title: string;
  onChatClick: () => void;
}

const BookingHeader = ({ title, onChatClick }: BookingHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button
        variant="ghost"
        size="icon"
        onClick={onChatClick}
        className="hover:bg-gray-100"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default BookingHeader;