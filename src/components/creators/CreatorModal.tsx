import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const [showCampaigns, setShowCampaigns] = useState(false);

  const { data: campaigns } = useQuery({
    queryKey: ['brand-campaigns'],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!brand) return [];

      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .eq('brand_id', brand.id)
        .eq('status', 'open');

      return opportunities || [];
    },
  });

  if (!creator) return null;

  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  const handleInvite = async (opportunityId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create application on behalf of the creator
    await supabase
      .from('applications')
      .insert({
        opportunity_id: opportunityId,
        creator_id: creator.id,
        status: 'invited'
      });

    setShowCampaigns(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {fullName || 'Anonymous Creator'}
          </DialogTitle>
        </DialogHeader>
        
        {!showCampaigns ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
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

              <Button
                className="w-full mt-4 bg-nino-primary hover:bg-nino-primary/90"
                onClick={() => setShowCampaigns(true)}
              >
                Invite to Campaign
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <Button
              variant="ghost"
              onClick={() => setShowCampaigns(false)}
              className="mb-4"
            >
              ← Back
            </Button>

            <h3 className="text-lg font-semibold">Select Campaign</h3>
            
            {campaigns && campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 border rounded-xl hover:bg-nino-bg transition-colors cursor-pointer"
                    onClick={() => handleInvite(campaign.id)}
                  >
                    <h4 className="font-medium">{campaign.title}</h4>
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active campaigns found</p>
                <Button
                  onClick={() => window.location.href = '/brand/campaigns/new'}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Campaign
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;