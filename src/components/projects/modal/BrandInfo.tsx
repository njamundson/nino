import { Badge } from "@/components/ui/badge";

interface BrandInfoProps {
  companyName: string;
  brandType: string;
  location: string | null;
}

const BrandInfo = ({ companyName, brandType, location }: BrandInfoProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-nino-primary">
        {companyName}
      </h3>
      <div className="flex items-center gap-4 text-sm text-nino-gray">
        {location && (
          <span className="flex items-center gap-1">
            📍 {location}
          </span>
        )}
        {brandType && (
          <Badge variant="secondary">
            {brandType}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default BrandInfo;