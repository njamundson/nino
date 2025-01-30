import { Button } from "@/components/ui/button";
import { Instagram, Globe } from "lucide-react";
import { formatInstagramUrl, formatWebsiteUrl } from "@/utils/socialMediaUtils";

interface CreatorSocialLinksProps {
  instagram: string | null;
  website: string | null;
}

const CreatorSocialLinks = ({ instagram, website }: CreatorSocialLinksProps) => {
  if (!instagram && !website) return null;
  
  return null; // Since we're removing these buttons entirely
};

export default CreatorSocialLinks;