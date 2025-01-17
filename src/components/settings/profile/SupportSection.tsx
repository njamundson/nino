import { Button } from "@/components/ui/button";
import { HelpCircle, Shield } from "lucide-react";

const SupportSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Support</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="w-full">
          <HelpCircle className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
        <Button variant="outline" className="w-full">
          <Shield className="w-4 h-4 mr-2" />
          View FAQ
        </Button>
      </div>
    </div>
  );
};

export default SupportSection;