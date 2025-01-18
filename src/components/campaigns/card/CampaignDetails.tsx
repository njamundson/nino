import { format } from "date-fns";

interface CampaignDetailsProps {
  campaign: any;
}

const CampaignDetails = ({ campaign }: CampaignDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="space-y-1.5">
          {campaign.location && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">📍</span>
              {campaign.location}
            </p>
          )}
          {campaign.payment_details && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">💰</span>
              {campaign.payment_details}
            </p>
          )}
          {campaign.compensation_details && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">🎁</span>
              {campaign.compensation_details}
            </p>
          )}
        </div>

        {campaign.start_date && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">🗓️</span>
              {format(new Date(campaign.start_date), 'MMM d, yyyy')}
              {campaign.end_date && (
                <span className="text-gray-400">→</span>
              )}
              {campaign.end_date && format(new Date(campaign.end_date), 'MMM d, yyyy')}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {campaign.requirements?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
            <ul className="space-y-1">
              {campaign.requirements.map((req: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {campaign.deliverables?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Deliverables</h4>
            <ul className="space-y-1">
              {campaign.deliverables.map((del: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  {del}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;