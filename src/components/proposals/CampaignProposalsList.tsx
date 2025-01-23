import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ProposalItem from "./ProposalItem";
import EmptyProposals from "./EmptyProposals";

// Dummy data for UI development covering different scenarios
const dummyProposals = [
  {
    id: '1',
    creator: {
      id: 'c1',
      bio: 'Lifestyle and travel content creator with 5+ years of experience',
      location: 'Los Angeles, CA',
      instagram: '@travelwithsarah',
      website: 'www.travelwithsarah.com',
      user_id: 'u1',
      profile: {
        first_name: 'Sarah',
        last_name: 'Johnson'
      }
    },
    cover_letter: "I'm excited about this opportunity! With my experience in lifestyle photography and a following of over 50k engaged followers, I believe I can create authentic content that resonates with your brand's message."
  },
  {
    id: '2',
    creator: {
      id: 'c2',
      bio: 'Professional photographer specializing in product photography',
      location: 'New York, NY',
      instagram: '@mikevisuals',
      website: 'www.mikephotography.com',
      user_id: 'u2',
      profile: {
        first_name: 'Mike',
        last_name: 'Smith'
      }
    },
    cover_letter: "Having worked with several fashion brands, I understand the importance of showcasing products in their best light. My portfolio demonstrates my ability to create high-quality, commercial-ready content."
  },
  {
    id: '3',
    creator: {
      id: 'c3',
      bio: 'Food and lifestyle blogger',
      location: 'Chicago, IL',
      instagram: '@foodiemaria',
      website: 'www.mariaeats.com',
      user_id: 'u3',
      profile: {
        first_name: 'Maria',
        last_name: 'Garcia'
      }
    },
    cover_letter: "As a food enthusiast and content creator, I specialize in creating mouthwatering content that tells a story. I'd love to bring your brand's culinary vision to life!"
  },
  {
    id: '4',
    creator: {
      id: 'c4',
      bio: 'Fitness and wellness influencer',
      location: 'Miami, FL',
      instagram: '@fitwithalex',
      website: 'www.alexfitness.com',
      user_id: 'u4',
      profile: {
        first_name: 'Alex',
        last_name: 'Thompson'
      }
    },
    cover_letter: "With a background in personal training and 3 years of content creation experience, I create engaging fitness content that motivates and inspires. Let's work together to promote a healthy lifestyle!"
  },
  {
    id: '5',
    creator: {
      id: 'c5',
      bio: 'Tech reviewer and digital content creator',
      location: 'San Francisco, CA',
      instagram: '@techwithjames',
      website: 'www.jamestech.com',
      user_id: 'u5',
      profile: {
        first_name: 'James',
        last_name: 'Lee'
      }
    },
    cover_letter: "I specialize in creating detailed, engaging tech content that educates and entertains. My audience trusts my honest reviews and recommendations."
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

          {(!dummyProposals || dummyProposals.length === 0) && <EmptyProposals type="proposal" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignProposalsList;