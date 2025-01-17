import { Badge } from "@/components/ui/badge";

interface BrandInfoProps {
  companyName: string;
  brandType: string;
  location: string | null;
}

const BrandInfo = ({ companyName, brandType, location }: BrandInfoProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
      <span>{companyName}</span>
      {location && (
        <>
          <span>•</span>
          <span className="flex items-center gap-1">
            📍 {location}
          </span>
        </>
      )}
      {brandType && (
        <>
          <span>•</span>
          <Badge variant="secondary" className="text-xs">
            {brandType}
          </Badge>
        </>
      )}
    </div>
  );
};

export default BrandInfo;