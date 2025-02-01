import { Card } from "@/components/ui/card";
import { Creator } from "@/types/creator";

export interface BookingDetailsCardProps {
  creator?: Creator;
  onCancel?: () => void;
  onDelete?: () => void;
  status?: string;
  booking?: any;
  onChatClick?: () => void;
  onViewCreator?: () => void;
  onRefresh?: () => void;
}

export const BookingDetailsCard = ({
  creator,
  onCancel,
  onDelete,
  status = "pending",
  booking,
  onChatClick,
  onViewCreator,
  onRefresh
}: BookingDetailsCardProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{creator?.display_name || "Unknown Creator"}</h2>
        <div className="flex space-x-2">
          {onChatClick && (
            <button onClick={onChatClick} className="text-blue-500 hover:underline">
              Chat
            </button>
          )}
          {onViewCreator && (
            <button onClick={onViewCreator} className="text-blue-500 hover:underline">
              View Creator
            </button>
          )}
          {onCancel && (
            <button onClick={onCancel} className="text-red-500 hover:underline">
              Cancel
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-red-500 hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">Status: {status}</p>
        <p className="text-sm">{booking?.details || "No details available."}</p>
      </div>
    </Card>
  );
};

export default BookingDetailsCard;
