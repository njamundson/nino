import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Creator } from "@/types/creator";
import { Calendar, MapPin, MessageSquare, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BookingCardProps {
  creator: Creator;
  opportunity: {
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
    brand?: {
      company_name: string | null;
      id?: string;
      user_id?: string;
    } | null;
  } | null;
  onMessageClick: () => void;
  onViewCreator: () => void;
  onCancel?: () => void;
}

const BookingCard = ({ creator, opportunity, onMessageClick, onViewCreator, onCancel }: BookingCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!opportunity) {
    return null;
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      toast({
        title: "Booking cancelled",
        description: "The brand has been notified of this cancellation.",
      });
    }
  };

  const handleMessageClick = () => {
    if (!opportunity.brand?.user_id) {
      // Query the brand's user_id from the brands table using the brand_id
      const brandId = opportunity.brand?.id;
      if (!brandId) {
        toast({
          title: "Error",
          description: "Could not find brand information to start chat.",
          variant: "destructive",
        });
        return;
      }

      // Navigate to messages with brand's ID as a query parameter
      navigate(`/messages?brandId=${brandId}`);
      return;
    }

    // If we have the user_id, use it directly
    navigate(`/messages?userId=${opportunity.brand.user_id}`);
  };

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          {opportunity.brand?.company_name && (
            <p className="text-sm font-medium text-nino-primary">
              {opportunity.brand.company_name}
            </p>
          )}
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {opportunity.title}
          </h3>
          <Badge 
            variant="secondary" 
            className="bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
          >
            Active Booking
          </Badge>
        </div>
        {onCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this booking? This action cannot be undone and the brand will be notified.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Yes, cancel booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="space-y-4">
        {opportunity.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {opportunity.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500">
          {(opportunity.start_date || opportunity.end_date) && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                {opportunity.start_date && formatDate(opportunity.start_date)}
                {opportunity.start_date && opportunity.end_date && " - "}
                {opportunity.end_date && formatDate(opportunity.end_date)}
              </span>
            </div>
          )}

          {opportunity.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{opportunity.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {opportunity.payment_details && (
            <Badge variant="outline" className="rounded-full border-gray-200">
              💰 {opportunity.payment_details}
            </Badge>
          )}
          {opportunity.compensation_details && (
            <Badge variant="outline" className="rounded-full border-gray-200">
              🎁 {opportunity.compensation_details}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={handleMessageClick}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Message Brand
        </Button>
      </div>
    </Card>
  );
};

export default BookingCard;