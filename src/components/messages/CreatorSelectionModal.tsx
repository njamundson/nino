import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface CreatorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (userId: string, displayName: string, profileImage: string | null) => void;
}

const CreatorSelectionModal = ({ isOpen, onClose, onSelect }: CreatorSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: creators, isLoading } = useQuery({
    queryKey: ["creators-for-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creators')
        .select(`
          id,
          user_id,
          display_name,
          profile_image_url
        `)
        .not('user_id', 'is', null);

      if (error) {
        console.error("Error fetching creators:", error);
        throw error;
      }

      return data || [];
    },
  });

  const filteredCreators = creators?.filter((creator) => {
    const name = creator.display_name.toLowerCase().trim();
    return name.includes(searchQuery.toLowerCase());
  });

  const getInitials = (displayName: string) => {
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search creators..."
            className="pl-9 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-2">
              {filteredCreators?.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    onSelect(
                      creator.user_id,
                      creator.display_name,
                      creator.profile_image_url
                    );
                    onClose();
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.profile_image_url || ""} />
                    <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                      {getInitials(creator.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {creator.display_name}
                    </p>
                  </div>
                </div>
              ))}

              {filteredCreators?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No creators found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatorSelectionModal;