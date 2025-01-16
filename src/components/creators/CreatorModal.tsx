import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

interface CreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

const CreatorModal = ({ creator, isOpen, onClose }: CreatorModalProps) => {
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  if (!creator) return null;

  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  const handleInvite = () => {
    setIsInviting(true);
    // Simulate API call
    setTimeout(() => {
      setIsInviting(false);
      toast({
        title: "Invitation sent",
        description: `${fullName} has been invited to your campaign.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-full min-h-[400px] bg-gray-100">
            <img
              src={creator.imageUrl}
              alt={fullName}
              className="absolute inset-0 object-cover w-full h-full"
            />
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {fullName || 'Anonymous Creator'}
                </h2>
                {creator.location && (
                  <p className="text-sm text-nino-gray">
                    📍 {creator.location}
                  </p>
                )}
              </div>
            </DialogHeader>

            {creator.bio && (
              <p className="text-base leading-relaxed text-nino-text">
                {creator.bio}
              </p>
            )}

            {creator.specialties && creator.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {creator.specialties.map((specialty, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="border-2 border-nino-primary text-nino-primary px-3 py-1"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleInvite}
                disabled={isInviting}
                className="w-full bg-nino-primary hover:bg-nino-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isInviting ? "Sending invitation..." : "Invite to Campaign"}
              </Button>

              <div className="flex gap-3">
                {creator.instagram && (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>
                )}
                
                {creator.website && (
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => window.open(creator.website!, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;