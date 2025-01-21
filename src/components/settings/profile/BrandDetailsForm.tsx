import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProfileImageSection from "./ProfileImageSection";

interface BrandDetailsFormProps {
  loading: boolean;
  profileImage: string | null;
  brandData: {
    brandName: string;
    brandEmail: string;
    brandBio: string;
    homeLocation: string;
    instagram: string;
    website: string;
    location: string;
    brandType: string;
  };
  onUpdateField: (field: string, value: any) => void;
  onUpdateImage: (url: string | null) => void;
}

const BrandDetailsForm = ({
  loading,
  profileImage,
  brandData,
  onUpdateField,
  onUpdateImage,
}: BrandDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <ProfileImageSection 
        profileImage={profileImage}
        setProfileImage={onUpdateImage}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={brandData.brandName}
            onChange={(e) => onUpdateField("brandName", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandEmail">Brand Email</Label>
          <Input
            id="brandEmail"
            type="email"
            value={brandData.brandEmail}
            onChange={(e) => onUpdateField("brandEmail", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandBio">Brand Bio</Label>
          <Textarea
            id="brandBio"
            value={brandData.brandBio}
            onChange={(e) => onUpdateField("brandBio", e.target.value)}
            disabled={loading}
            className="bg-white/50 min-h-[100px]"
            placeholder="Tell us about your brand..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="homeLocation">Home Location</Label>
          <Input
            id="homeLocation"
            value={brandData.homeLocation}
            onChange={(e) => onUpdateField("homeLocation", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="Where is your brand based?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default BrandDetailsForm;