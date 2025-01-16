import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CampaignProposalsListProps {
  campaignId: string;
}

// Dummy data for UI development
const dummyProposals = [
  {
    id: '1',
    creator: {
      id: 'c1',
      bio: 'Lifestyle and travel content creator',
      location: 'Los Angeles, CA',
      instagram: '@creator1',
      website: 'creator1.com',
      user_id: 'u1',
      profile: {
        first_name: 'John',
        last_name: 'Doe'
      }
    },
    cover_letter: "I'm excited to work on this campaign and bring my unique perspective to your brand."
  },
  {
    id: '2',
    creator: {
      id: 'c2',
      bio: 'Fashion and beauty influencer',
      location: 'New York, NY',
      instagram: '@creator2',
      website: 'creator2.com',
      user_id: 'u2',
      profile: {
        first_name: 'Jane',
        last_name: 'Smith'
      }
    },
    cover_letter: "With my experience in fashion photography, I believe I can create amazing content for your brand."
  }
];

const CampaignProposalsList = ({ campaignId }: CampaignProposalsListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async (proposalId: string) => {
    toast({
      title: "Success",
      description: "Proposal deleted successfully.",
    });
  };

  const handleChat = (creatorId: string) => {
    navigate(`/messages?user=${creatorId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dummyProposals.map((proposal) => (
        <Card key={proposal.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {proposal.creator.profile.first_name} {proposal.creator.profile.last_name}
                </h3>
                {proposal.creator.location && (
                  <p className="text-sm text-gray-500">{proposal.creator.location}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChat(proposal.creator.user_id)}
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
                  onClick={() => handleDelete(proposal.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            {proposal.cover_letter && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {proposal.cover_letter}
                </p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CampaignProposalsList;