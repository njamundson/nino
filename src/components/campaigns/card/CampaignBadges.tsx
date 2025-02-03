import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface CampaignBadgesProps {
  paymentDetails: string | null;
  compensationDetails: string | null;
  statusBadgeProps: {
    variant: "default" | "secondary" | "destructive";
    className: string;
    children: string;
  };
}

const CampaignBadges = ({
  paymentDetails,
  compensationDetails,
  statusBadgeProps,
}: CampaignBadgesProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex flex-wrap gap-2 ${isMobile ? 'flex-col items-start' : ''}`}>
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'w-full' : ''}`}>
        {paymentDetails && (
          <Badge 
            variant="secondary" 
            className={`bg-nino-bg text-nino-text px-2 py-0.5 text-sm whitespace-nowrap ${
              isMobile ? 'w-full justify-start' : 'max-w-[150px] sm:max-w-[200px]'
            }`}
          >
            <span className={`inline-block truncate ${isMobile ? 'w-full' : ''}`}>
              💰 {paymentDetails}
            </span>
          </Badge>
        )}
        {compensationDetails && (
          <Badge 
            variant="secondary" 
            className={`bg-nino-bg text-nino-text px-2 py-0.5 text-sm whitespace-nowrap ${
              isMobile ? 'w-full justify-start' : 'max-w-[150px] sm:max-w-[200px]'
            }`}
          >
            <span className={`inline-block truncate ${isMobile ? 'w-full' : ''}`}>
              🎁 {compensationDetails}
            </span>
          </Badge>
        )}
      </div>
      <Badge
        variant={statusBadgeProps.variant}
        className={`${statusBadgeProps.className} ${isMobile ? 'self-start' : ''}`}
      >
        {statusBadgeProps.children}
      </Badge>
    </div>
  );
};

export default CampaignBadges;