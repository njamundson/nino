import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe } from "lucide-react";

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
  if (!creator) return null;

  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {fullName || 'Anonymous Creator'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <img
              src={creator.imageUrl}
              alt={fullName}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="space-y-4">
            {creator.location && (
              <p className="text-muted-foreground">
                📍 {creator.location}
              </p>
            )}
            
            {creator.bio && (
              <p className="text-base leading-relaxed">
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

            <div className="flex gap-3 pt-2">
              {creator.instagram && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
              )}
              
              {creator.website && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(creator.website!, '_blank')}
                >
                  <Globe className="w-4 h-4" />
                  Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;