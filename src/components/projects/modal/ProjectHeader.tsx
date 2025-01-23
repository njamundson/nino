import { CalendarIcon, MapPinIcon } from "lucide-react";

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
    <div className="px-8 py-6 bg-white">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{companyName}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          {(startDate || endDate) && (
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {startDate && new Date(startDate).toLocaleDateString()} 
                {endDate && ` - ${new Date(endDate).toLocaleDateString()}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;