import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, XSquare } from "lucide-react";
import { toast } from "sonner";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  coverLetter,
  onUpdateStatus 
}: CreatorProfileModalProps) => {
  const handleAccept = () => {
    onUpdateStatus('accepted');
    toast.success("Application accepted successfully");
    onClose();
  };

  const handleReject = () => {
    onUpdateStatus('rejected');
    toast.error("Application rejected");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {creator?.profile?.first_name} {creator?.profile?.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={creator?.profile_image_url || "/placeholder.svg"}
              alt={`${creator?.profile?.first_name} ${creator?.profile?.last_name}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            {creator?.location && (
              <p className="text-gray-600 flex items-center gap-2">
                <span className="text-lg">📍</span> {creator.location}
              </p>
            )}

            {creator?.bio && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">About</h3>
                <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
              </div>
            )}

            {creator?.specialties && creator.specialties.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty: string, index: number) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="px-3 py-1 rounded-full"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Application Message</h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {coverLetter}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
              >
                <XSquare className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;