import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ProjectHeaderProps {
  title: string;
  companyName: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
}

const ProjectHeader = ({
  title,
  companyName,
  location,
  startDate,
  endDate,
}: ProjectHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-100 p-8 rounded-t-lg">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                {companyName}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            {location && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                📍 {location}
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                🗓️ {formatDate(startDate)}
                {endDate && ` - ${formatDate(endDate)}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;