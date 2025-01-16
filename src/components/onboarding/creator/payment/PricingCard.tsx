import { Check } from "lucide-react";

const PricingCard = () => {
  return (
    <div className="bg-nino-bg rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-nino-text">Nino Pro</h3>
          <p className="text-sm text-nino-gray">Monthly subscription</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-nino-text">$25</div>
          <div className="text-sm text-nino-gray">/month</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-nino-text">
          <Check className="w-4 h-4 text-nino-primary" />
          <span>Access to All Nino Jobs</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-nino-text">
          <Check className="w-4 h-4 text-nino-primary" />
          <span>Unlimited Collaborations</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-nino-text">
          <Check className="w-4 h-4 text-nino-primary" />
          <span>Direct Messaging with Brands</span>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;