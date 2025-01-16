import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
    };
  };
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {opportunity.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Brand Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-nino-primary">
              {opportunity.brand.company_name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-nino-gray">
              {opportunity.location && (
                <span className="flex items-center gap-1">
                  📍 {opportunity.location}
                </span>
              )}
              {opportunity.brand.brand_type && (
                <Badge variant="secondary">
                  {opportunity.brand.brand_type}
                </Badge>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{opportunity.description}</p>
            </div>

            {/* Dates */}
            {(opportunity.start_date || opportunity.end_date) && (
              <div className="space-y-2">
                <h4 className="font-medium">Project Timeline</h4>
                <div className="flex gap-4 text-sm">
                  {opportunity.start_date && (
                    <div>
                      <span className="text-nino-gray">Start Date:</span>{" "}
                      {formatDate(opportunity.start_date)}
                    </div>
                  )}
                  {opportunity.end_date && (
                    <div>
                      <span className="text-nino-gray">End Date:</span>{" "}
                      {formatDate(opportunity.end_date)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {opportunity.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {opportunity.perks && opportunity.perks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Perks</h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.perks.map((perk, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
                    >
                      {perk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;