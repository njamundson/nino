import { Card } from "@/components/ui/card";
import { Creator } from "@/types/creator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, RefreshCw } from "lucide-react";

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
    <Card className="p-6 bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-gray-200 transition-all duration-200">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {creator?.profileImage ? (
              <img
                src={creator.profileImage}
                alt={creator?.display_name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-nino-primary/10 flex items-center justify-center ring-2 ring-white">
                <span className="text-lg font-medium text-nino-primary">
                  {creator?.display_name?.[0]?.toUpperCase() || 'C'}
                </span>
              </div>
            )}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900">
                {creator?.display_name || "Unknown Creator"}
              </h3>
              <Badge 
                variant="secondary" 
                className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
              >
                {status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            {onChatClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onChatClick}
                className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            )}
            {onViewCreator && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onViewCreator}
                className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {booking?.details && (
          <div className="text-sm text-gray-500">
            <p>{booking.details}</p>
          </div>
        )}

        {(onCancel || onDelete) && (
          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                onClick={onDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingDetailsCard;