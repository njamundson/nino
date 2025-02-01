import { Card } from "@/components/ui/card";
import ProjectDetails from "./ProjectDetails";
import CompensationDetails from "./CompensationDetails";
import CreatorSection from "./CreatorSection";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Creator } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

interface BookingDetailsCardProps {
  creator: {
    id: string;
    first_name?: string;
    last_name?: string | null;
    profile_image_url: string | null;
    display_name: string;
    bio?: string;
    location?: string;
    instagram?: string;
    website?: string;
    specialties?: string[];
    creator_type?: string;
    user_id?: string;
  };
  booking: {
    id: string;
    opportunity: {
      id: string;
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
  };
  onChatClick: () => void;
  onViewCreator: () => void;
  onRefresh: () => void;
  onDelete?: () => void;
}

const BookingDetailsCard = ({
  creator,
  booking,
  onChatClick,
  onViewCreator,
  onRefresh,
  onDelete,
}: BookingDetailsCardProps) => {
  const { toast } = useToast();
  const mappedCreator = mapCreatorData(creator);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      toast({
        title: "Campaign deleted",
        description: "The creator will be notified of this change.",
      });
    }
  };

  return (
    <Card className="p-6 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm space-y-6 relative">
      {onDelete && (
        <div className="absolute top-6 right-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this campaign? The creator will be notified.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <ProjectDetails opportunity={booking.opportunity} />
      <CompensationDetails
        payment_details={booking.opportunity.payment_details}
        compensation_details={booking.opportunity.compensation_details}
        deliverables={booking.opportunity.deliverables}
        requirements={booking.opportunity.requirements}
      />
      <CreatorSection 
        creator={mappedCreator}
        onChatClick={onChatClick}
        onViewCreator={onViewCreator}
      />
    </Card>
  );
};

export default BookingDetailsCard;