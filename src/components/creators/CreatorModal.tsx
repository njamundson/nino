import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatorProfile from "./modal/CreatorProfile";
import CampaignSelection from "./modal/CampaignSelection";
import { MessageSquare, Instagram, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Creator {
  id: string;
  bio: string;
  instagram: string | null;
  website: string | null;
  location: string | null;
  specialties: string[];
  is_verified: boolean;
  profile_image_url: string | null;
  profile: {
    first_name: string;
    last_name: string;
  };
}

interface CreatorModalProps {
  creator: Creator;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (creatorId: string) => void;
}

const CreatorModal = ({ creator, isOpen, onClose, onInvite }: CreatorModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-3xl font-semibold text-nino-text">
            {creator.profile.first_name} {creator.profile.last_name}
          </h2>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/80"
              onClick={() => {}} // Chat functionality to be implemented
            >
              <MessageSquare className="h-5 w-5" strokeWidth={1.5} />
            </Button>
            {creator.instagram && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/80"
                onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            )}
            {creator.website && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/80"
                onClick={() => window.open(creator.website!, '_blank')}
              >
                <Globe className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            )}
          </div>
        </div>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-nino-primary data-[state=active]:bg-transparent"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="invite"
              className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-nino-primary data-[state=active]:bg-transparent"
            >
              Invite to Campaign
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="p-6">
            <CreatorProfile creator={creator} />
          </TabsContent>
          <TabsContent value="invite" className="p-6">
            <CampaignSelection creatorId={creator.id} onInvite={onInvite} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;