import { formatDate } from "@/lib/utils";

interface ProjectMetadataProps {
  location: string | null;
  start_date: string | null;
}

const ProjectMetadata = ({ location, start_date }: ProjectMetadataProps) => {
  return (
    <div className="space-y-2">
      {location && (
        <p className="text-sm text-white/80 flex items-center gap-1">
          📍 {location}
        </p>
      )}
      
      {start_date && (
        <p className="text-sm text-white/80">
          🗓️ {formatDate(start_date)}
        </p>
      )}
    </div>
  );
};

export default ProjectMetadata;