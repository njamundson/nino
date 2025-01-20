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
  onSelect: (creatorId: string) => void;
}

interface Creator {
  id: string;
  profile_image_url: string | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const CreatorSelectionModal = ({ isOpen, onClose, onSelect }: CreatorSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: creators, isLoading } = useQuery({
    queryKey: ["creators-for-messages"],
    queryFn: async () => {
      // First get all creators
      const { data, error } = await supabase
        .from("creators")
        .select(`
          id,
          profile_image_url,
          profiles (
            first_name,
            last_name,
            id
          )
        `);

      if (error) {
        console.error("Error fetching creators:", error);
        throw error;
      }

      // Ensure the data matches our Creator type
      const typedData = (data || []).map((item: any): Creator => ({
        id: item.id,
        profile_image_url: item.profile_image_url,
        profiles: item.profiles ? {
          first_name: item.profiles.first_name,
          last_name: item.profiles.last_name
        } : null
      }));

      return typedData;
    },
  });

  const filteredCreators = creators?.filter((creator) => {
    const fullName = `${creator.profiles?.first_name || ''} ${creator.profiles?.last_name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

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
            className="pl-9"
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
                    onSelect(creator.profiles?.id || '');
                    onClose();
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.profile_image_url || ""} />
                    <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                      {creator.profiles?.first_name?.[0]}
                      {creator.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {creator.profiles?.first_name} {creator.profiles?.last_name}
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