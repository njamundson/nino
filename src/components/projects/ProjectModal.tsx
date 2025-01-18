import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Globe, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Brand {
  company_name: string;
  brand_type: string;
  location: string | null;
  description: string;
  website: string;
  instagram: string;
}

interface Opportunity {
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
  brand: Brand;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-2xl bg-white">
        <div className="grid grid-cols-3 h-full">
          {/* Left Column - Project Details */}
          <div className="col-span-2 p-8 overflow-y-auto max-h-[90vh] space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">{opportunity.title}</h2>
              <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
            </div>

            <div className="space-y-6">
              {/* Project Metadata */}
              <div className="grid grid-cols-2 gap-4">
                {opportunity.location && (
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">📍</span>
                      {opportunity.location}
                    </p>
                  </div>
                )}
                {(opportunity.start_date || opportunity.end_date) && (
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">🗓️</span>
                      {opportunity.start_date && formatDate(opportunity.start_date)}
                      {opportunity.end_date && ` - ${formatDate(opportunity.end_date)}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Compensation Details */}
              {(opportunity.payment_details || opportunity.compensation_details) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Compensation</h3>
                  <div className="flex gap-2 flex-wrap">
                    {opportunity.payment_details && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                        💰 {opportunity.payment_details}
                      </Badge>
                    )}
                    {opportunity.compensation_details && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        🎁 {opportunity.compensation_details}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Requirements</h3>
                  <ul className="space-y-2">
                    {opportunity.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deliverables */}
              {opportunity.deliverables && opportunity.deliverables.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Deliverables</h3>
                  <ul className="space-y-2">
                    {opportunity.deliverables.map((del, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Perks */}
              {opportunity.perks && opportunity.perks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Perks</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.perks.map((perk, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                      >
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Brand Info */}
          <div className="border-l border-gray-100 p-8 bg-gray-50 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">About the Brand</h3>
              <div className="space-y-2">
                <p className="text-lg font-medium">{opportunity.brand.company_name}</p>
                <Badge variant="secondary" className="bg-gray-100">
                  {opportunity.brand.brand_type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {opportunity.brand.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-3">
                {opportunity.brand.website && (
                  <a
                    href={opportunity.brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {opportunity.brand.instagram && (
                  <a
                    href={`https://instagram.com/${opportunity.brand.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
              </div>
            </div>

            <Separator />

            <Button className="w-full" size="lg">
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;