import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfileImageSection from "./ProfileImageSection";

interface BrandProfileFormProps {
  loading: boolean;
  profileImage: string | null;
  brandData: {
    company_name: string;
    brand_type: string;
    description: string;
    website: string;
    instagram: string;
    location: string;
  };
  onUpdateField: (field: string, value: any) => void;
  onUpdateImage: (url: string | null) => void;
}

const BrandProfileForm = ({
  loading,
  profileImage,
  brandData,
  onUpdateField,
  onUpdateImage,
}: BrandProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Brand Profile</h3>
        <p className="text-sm text-gray-500">
          Update your brand information and online presence
        </p>
      </div>

      <ProfileImageSection 
        profileImage={profileImage}
        setProfileImage={onUpdateImage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">Brand Name</Label>
          <Input
            id="company_name"
            value={brandData.company_name}
            onChange={(e) => onUpdateField("company_name", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_type">Brand Type</Label>
          <Select
            value={brandData.brand_type}
            onValueChange={(value) => onUpdateField("brand_type", value)}
            disabled={loading}
          >
            <SelectTrigger className="bg-white/50">
              <SelectValue placeholder="Select brand type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="resort">Resort</SelectItem>
              <SelectItem value="travel_agency">Travel Agency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Brand Description</Label>
          <Textarea
            id="description"
            value={brandData.description}
            onChange={(e) => onUpdateField("description", e.target.value)}
            disabled={loading}
            className="bg-white/50 min-h-[100px]"
            placeholder="Tell us about your brand..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={brandData.website}
            onChange={(e) => onUpdateField("website", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="https://"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={brandData.instagram}
            onChange={(e) => onUpdateField("instagram", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="@username"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={brandData.location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="Where is your brand based?"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandProfileForm;