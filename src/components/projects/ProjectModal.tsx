import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import ApplicationForm from "./modal/ApplicationForm";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    perks: string[] | null;
    requirements: string[] | null;
    payment_details: string | null;
    compensation_details: string | null;
    deliverables: string[] | null;
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
      description?: string;
      website?: string;
      instagram?: string;
    };
  };
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  const [showApplication, setShowApplication] = useState(false);

  if (showApplication) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <ApplicationForm 
            opportunity={opportunity}
            onBack={() => setShowApplication(false)}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6 py-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="w-4 h-4" />
              <span>{opportunity.brand.company_name}</span>
            </div>
            <h2 className="text-2xl font-semibold">{opportunity.title}</h2>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {opportunity.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{opportunity.location}</span>
              </div>
            )}
            {opportunity.start_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{formatDate(opportunity.start_date)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600">{opportunity.description}</p>

          {/* Requirements and Perks Grid */}
          <div className="grid grid-cols-2 gap-6">
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Requirements</h3>
                <ul className="space-y-1">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">• {req}</li>
                  ))}
                </ul>
              </div>
            )}
            {opportunity.perks && opportunity.perks.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Perks</h3>
                <ul className="space-y-1">
                  {opportunity.perks.map((perk, index) => (
                    <li key={index} className="text-sm text-gray-600">• {perk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Compensation Details */}
          <div className="flex gap-2">
            {opportunity.payment_details && (
              <Badge variant="secondary">💰 {opportunity.payment_details}</Badge>
            )}
            {opportunity.compensation_details && (
              <Badge variant="secondary">🎁 {opportunity.compensation_details}</Badge>
            )}
          </div>

          {/* Apply Button */}
          <div className="flex justify-end">
            <Button onClick={() => setShowApplication(true)}>
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;