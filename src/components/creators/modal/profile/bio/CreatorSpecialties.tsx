import { Badge } from "@/components/ui/badge";
import { Application } from "@/integrations/supabase/types/opportunity";

interface CreatorSpecialtiesProps {
  specialties?: string[];
  application?: Application | null;
}

const CreatorSpecialties = ({ specialties, application }: CreatorSpecialtiesProps) => {
  return (
    <div className="space-y-3">
      {specialties?.length ? (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
          <div className="flex flex-wrap gap-1.5">
            {specialties.map((specialty: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-white/50"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {application && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-nino-text">Application Details</h3>
          <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 space-y-2">
            {application.opportunity && (
              <p className="text-sm text-gray-600">
                Applied for: <span className="font-medium">{application.opportunity.title}</span>
              </p>
            )}
            {application.status && (
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium capitalize">{application.status}</span>
              </p>
            )}
            {application.created_at && (
              <p className="text-sm text-gray-600">
                Submitted: <span className="font-medium">
                  {new Date(application.created_at).toLocaleDateString()}
                </span>
              </p>
            )}
            {application.cover_letter && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {application.cover_letter}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorSpecialties;