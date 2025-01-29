import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Calendar, MapPin, UserRound, XCircle, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingCardProps {
  booking: {
    id: string;
    opportunity: {
      title: string;
      status: string;
      start_date: string | null;
      end_date: string | null;
      location: string | null;
      payment_details: string | null;
      compensation_details: string | null;
      deliverables?: string[] | null;
      requirements?: string[] | null;
    };
    creator: {
      bio: string | null;
      specialties: string[] | null;
      profile: {
        first_name: string | null;
        last_name: string | null;
      } | null;
      profile_image_url: string | null;
    };
    created_at: string;
  };
  onChatClick: () => void;
  onViewCreator: () => void;
  onRefresh?: () => void;
}

const BookingCard = ({ booking, onChatClick, onViewCreator, onRefresh }: BookingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();
  
  const creatorName = booking.creator.profile ? 
    `${booking.creator.profile.first_name} ${booking.creator.profile.last_name}` : 
    'Anonymous Creator';

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChatClick();
  };

  const handleViewCreator = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewCreator();
  };

  const handleCancelBooking = async () => {
    try {
      // Update the application status to 'cancelled'
      const { error } = await supabase
        .from('applications')
        .update({ status: 'cancelled' })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: `The booking with ${creatorName} has been cancelled.`,
      });

      // Close the dialog
      setShowCancelDialog(false);
      
      // Refresh the bookings list if onRefresh is provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300">
      <div className="p-6 space-y-6">
        {/* Project Details Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                {booking.opportunity.title}
              </h3>
              <Badge 
                variant="secondary" 
                className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
              >
                {booking.opportunity.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            {(booking.opportunity.start_date || booking.opportunity.end_date) && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  {booking.opportunity.start_date && formatDate(booking.opportunity.start_date)}
                  {booking.opportunity.start_date && booking.opportunity.end_date && " - "}
                  {booking.opportunity.end_date && formatDate(booking.opportunity.end_date)}
                </span>
              </div>
            )}

            {booking.opportunity.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{booking.opportunity.location}</span>
              </div>
            )}
          </div>

          {/* Compensation Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {booking.opportunity.payment_details && (
                <Badge variant="outline" className="rounded-full border-gray-200">
                  💰 {booking.opportunity.payment_details}
                </Badge>
              )}
              {booking.opportunity.compensation_details && (
                <Badge variant="outline" className="rounded-full border-gray-200">
                  🎁 {booking.opportunity.compensation_details}
                </Badge>
              )}
            </div>

            {/* Deliverables Section */}
            {booking.opportunity.deliverables && booking.opportunity.deliverables.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900">Deliverables</h5>
                <div className="flex flex-wrap gap-2">
                  {booking.opportunity.deliverables.map((deliverable, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                    >
                      {deliverable}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements Section */}
            {booking.opportunity.requirements && booking.opportunity.requirements.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900">Requirements</h5>
                <div className="flex flex-wrap gap-2">
                  {booking.opportunity.requirements.map((requirement, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                    >
                      {requirement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booked Creator Section */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="border-t pt-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full bg-white hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">Booked Creator</h4>
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                  Active
                </Badge>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-4 space-y-4 animate-accordion-down bg-white">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group">
                <div className="flex items-center gap-4">
                  {booking.creator.profile_image_url ? (
                    <img 
                      src={booking.creator.profile_image_url}
                      alt={creatorName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-nino-primary/10 flex items-center justify-center ring-2 ring-white">
                      <span className="text-lg font-medium text-nino-primary">
                        {creatorName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{creatorName}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleChatClick}
                          className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chat with Creator</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleViewCreator}
                          className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                        >
                          <UserRound className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Profile</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCancelDialog(true);
                          }}
                          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                        >
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cancel Booking</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the booking with {creatorName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default BookingCard;