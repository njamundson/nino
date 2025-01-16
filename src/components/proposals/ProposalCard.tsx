import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, User, MapPin, CalendarDays, ExternalLink, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import CampaignProposalsModal from "./CampaignProposalsModal";

interface ProposalCardProps {
  application: any;
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalCard = ({ application, onUpdateStatus }: ProposalCardProps) => {
  const [showProposals, setShowProposals] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'accepted':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const creatorName = application.creator?.profile?.first_name && application.creator?.profile?.last_name
    ? `${application.creator.profile.first_name} ${application.creator.profile.last_name}`
    : "Anonymous Creator";

  const creatorInitials = creatorName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow duration-200">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{creatorInitials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {application.opportunity?.title}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {creatorName}
                </p>
              </div>
            </div>
            <Badge 
              variant="secondary"
              className={`${getStatusColor(application.status)} flex items-center gap-1.5`}
            >
              {getStatusIcon(application.status)}
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {application.creator?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {application.creator.location}
              </div>
            )}
            {application.opportunity?.start_date && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {formatDate(application.opportunity.start_date)}
              </div>
            )}
          </div>

          {application.cover_letter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {application.cover_letter}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              {application.opportunity?.payment_details && (
                <p className="text-sm text-gray-600">
                  💰 {application.opportunity.payment_details}
                </p>
              )}
              {application.opportunity?.compensation_details && (
                <p className="text-sm text-gray-600">
                  🎁 {application.opportunity.compensation_details}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowProposals(true)}
              >
                <Users className="w-4 h-4" />
                View Proposals
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`/opportunities/${application.opportunity_id}`, '_blank')}
              >
                View Opportunity
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              {application.status === 'pending' && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onUpdateStatus(application.id, 'accepted')}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUpdateStatus(application.id, 'rejected')}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      <CampaignProposalsModal
        isOpen={showProposals}
        onOpenChange={setShowProposals}
        campaignId={application.opportunity_id}
        campaignTitle={application.opportunity?.title}
      />
    </>
  );
};

export default ProposalCard;