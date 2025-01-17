import { Badge } from "@/components/ui/badge";

export interface BrandInfoProps {
  company_name: string;
  brand_type: string;
  location: string | null;
  description: string;
  website: string;
  instagram: string;
}

const BrandInfo = ({ 
  company_name, 
  brand_type, 
  location,
  description,
  website,
  instagram 
}: BrandInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{company_name}</span>
        {location && (
          <>
            <span>•</span>
            <span className="flex items-center gap-1">
              📍 {location}
            </span>
          </>
        )}
        {brand_type && (
          <>
            <span>•</span>
            <Badge variant="secondary" className="text-xs">
              {brand_type}
            </Badge>
          </>
        )}
      </div>

      {description && (
        <div>
          <h4 className="font-medium mb-1">About</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      <div className="space-y-2">
        {website && (
          <a 
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-primary hover:underline"
          >
            🌐 Website
          </a>
        )}
        {instagram && (
          <a 
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-primary hover:underline"
          >
            📸 Instagram
          </a>
        )}
      </div>
    </div>
  );
};

export default BrandInfo;