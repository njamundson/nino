import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreatorModal from "./CreatorModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

interface CreatorCardProps {
  creator: CreatorData;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const fullName = `${creator.firstName || ''} ${creator.lastName || ''}`.trim();

  const handleInvite = async (opportunityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to invite creators",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          creator_id: creator.id,
          status: 'invited'
        });

      if (error) {
        console.error("Error inviting creator:", error);
        toast({
          title: "Error",
          description: "Failed to invite creator. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Creator invited successfully!",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error in handleInvite:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={creator.profileImage || '/placeholder.svg'}
            alt={fullName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {creator.location && (
              <p className="mb-2 text-sm font-medium opacity-90">
                {creator.location}
              </p>
            )}
            <h3 className="text-xl font-semibold">
              {fullName || 'Anonymous Creator'}
            </h3>
            {creator.specialties && creator.specialties.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {creator.specialties.map((specialty, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-6 right-6 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleInvite(creator.id);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <CreatorModal
        creator={{
          ...creator,
          imageUrl: creator.profileImage || '/placeholder.svg'
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreatorCard;