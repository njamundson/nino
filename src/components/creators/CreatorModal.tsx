import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe, Plus, ArrowLeft } from "lucide-react";
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
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-nino-bg">
        {!showCampaigns ? (
          <div>
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-3xl font-semibold text-nino-text">
                {fullName || 'Anonymous Creator'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={creator.imageUrl}
                  alt={fullName}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="space-y-6">
                {creator.location && (
                  <p className="text-nino-gray flex items-center gap-2">
                    <span className="text-lg">📍</span> {creator.location}
                  </p>
                )}
                
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
                        className="px-4 py-1.5 rounded-full border-2 border-nino-primary text-nino-primary bg-white/50 hover:bg-white transition-colors"
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
                      size="lg"
                      className="rounded-xl gap-2 hover:bg-white/80"
                      onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                    >
                      <Instagram className="w-5 h-5" />
                      Instagram
                    </Button>
                  )}
                  
                  {creator.website && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-xl gap-2 hover:bg-white/80"
                      onClick={() => window.open(creator.website!, '_blank')}
                    >
                      <Globe className="w-5 h-5" />
                      Website
                    </Button>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full mt-6 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                  onClick={() => setShowCampaigns(true)}
                >
                  Invite to Campaign
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <Button
              variant="ghost"
              onClick={() => setShowCampaigns(false)}
              className="mb-4 hover:bg-white/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>

            <h3 className="text-xl font-semibold text-nino-text">Select Campaign</h3>
            
            {campaigns && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-6 border-2 border-white bg-white/50 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer group"
                    onClick={() => handleInvite(campaign.id)}
                  >
                    <h4 className="font-medium text-lg text-nino-text group-hover:text-nino-primary transition-colors">
                      {campaign.title}
                    </h4>
                    <p className="text-sm text-nino-gray mt-1">
                      {campaign.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 rounded-xl border-2 border-white">
                <p className="text-nino-gray mb-6">No active campaigns found</p>
                <Button
                  onClick={() => window.location.href = '/brand/campaigns/new'}
                  className="gap-2 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl"
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