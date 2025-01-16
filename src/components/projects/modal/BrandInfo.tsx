import { Badge } from "@/components/ui/badge";

interface BrandInfoProps {
  companyName: string;
  brandType: string;
  location: string | null;
}

const BrandInfo = ({ companyName, brandType, location }: BrandInfoProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-nino-primary">
        {companyName}
      </h3>
      <div className="flex items-center gap-4 text-sm">
        {location && (
          <span className="flex items-center gap-1 text-nino-gray">
            📍 {location}
          </span>
        )}
        {brandType && (
          <Badge variant="secondary" className="capitalize">
            {brandType.replace('_', ' ')}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default BrandInfo;