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
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-3xl shadow-[0_20px_80px_-10px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col">
          {/* Header Section with Image */}
          <div className="relative h-[400px] md:h-[450px]">
            <div className="absolute inset-0">
              <img
                src={creator.imageUrl}
                alt={fullName}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-4xl font-semibold text-white mb-3">
                {fullName || 'Anonymous Creator'}
              </h2>
              {creator.location && (
                <p className="text-white/90 text-xl font-light">
                  📍 {creator.location}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Bio Section */}
            {creator.bio && (
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-gray-700">
                  {creator.bio}
                </p>
              </div>
            )}

            {/* Specialties Section */}
            {creator.specialties && creator.specialties.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 bg-[#E5DEFF] text-[#1A1F2C] hover:bg-[#D6BCFA] border-0"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={handleInvite}
                disabled={isInviting}
                className="w-full bg-[#9b87f5] hover:bg-[#8b75f3] text-white py-6 rounded-2xl shadow-md transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                {isInviting ? "Sending invitation..." : "Invite to Campaign"}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                {creator.instagram && (
                  <Button
                    variant="outline"
                    className="w-full py-6 rounded-2xl border-[#E5DEFF] hover:bg-[#E5DEFF]/50 hover:border-[#9b87f5] transition-all duration-300"
                    onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Instagram
                  </Button>
                )}
                
                {creator.website && (
                  <Button
                    variant="outline"
                    className="w-full py-6 rounded-2xl border-[#E5DEFF] hover:bg-[#E5DEFF]/50 hover:border-[#9b87f5] transition-all duration-300"
                    onClick={() => window.open(creator.website!, '_blank')}
                  >
                    <Globe className="w-5 h-5 mr-2" />
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