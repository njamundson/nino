import { MessageCircle, Trash2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProposalItemProps {
  proposal: {
    id: string;
    creator: {
      id: string;
      bio: string;
      location: string;
      instagram: string;
      website: string;
      user_id: string;
      profile: {
        first_name: string;
        last_name: string;
      };
    };
    cover_letter: string;
  };
  onDelete: (id: string) => void;
  onChat: (userId: string) => void;
}

const ProposalItem = ({ proposal, onDelete, onChat }: ProposalItemProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-nino-bg/50">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-xs">
          {proposal.creator.profile.first_name?.[0]}
          {proposal.creator.profile.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-nino-text truncate">
              {proposal.creator.profile.first_name} {proposal.creator.profile.last_name}
            </p>
            {proposal.creator.location && (
              <p className="text-sm text-gray-500">{proposal.creator.location}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChat(proposal.creator.user_id)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/creators/${proposal.creator.id}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(proposal.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        {proposal.cover_letter && (
          <div className="mt-3 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {proposal.cover_letter}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalItem;