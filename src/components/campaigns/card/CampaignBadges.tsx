import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="flex flex-wrap gap-2">
      {paymentDetails && (
        <Badge 
          variant="secondary" 
          className="bg-nino-bg text-nino-text px-2 py-0.5 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[200px]"
        >
          <span className="inline-block truncate">
            💰 {paymentDetails}
          </span>
        </Badge>
      )}
      {compensationDetails && (
        <Badge 
          variant="secondary" 
          className="bg-nino-bg text-nino-text px-2 py-0.5 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[200px]"
        >
          <span className="inline-block truncate">
            🎁 {compensationDetails}
          </span>
        </Badge>
      )}
      <Badge
        variant={statusBadgeProps.variant}
        className={statusBadgeProps.className}
      >
        {statusBadgeProps.children}
      </Badge>
    </div>
  );
};

export default CampaignBadges;