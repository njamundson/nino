import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ProposalItem from "./ProposalItem";
import EmptyProposals from "./EmptyProposals";

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

interface CampaignProposalsListProps {
  campaignId: string;
}

const CampaignProposalsList = ({ campaignId }: CampaignProposalsListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleDelete = async (proposalId: string) => {
    toast({
      title: "Success",
      description: "Proposal deleted successfully.",
    });
  };

  const handleChat = (creatorId: string) => {
    navigate(`/messages?user=${creatorId}`);
  };

  return (
    <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-nino-text">Recent Messages</h3>
          <button className="p-2 hover:bg-nino-bg rounded-full transition-colors">
            <MessageSquare className="w-5 h-5 text-nino-primary" />
          </button>
        </div>

        <div className="space-y-4">
          {dummyProposals.map((proposal) => (
            <ProposalItem
              key={proposal.id}
              proposal={proposal}
              onDelete={handleDelete}
              onChat={handleChat}
            />
          ))}

          {(!dummyProposals || dummyProposals.length === 0) && <EmptyProposals />}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProposalsList;