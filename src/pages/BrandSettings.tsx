import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BrandData } from "@/types/brand";
import ProfileSettings from "@/components/settings/ProfileSettings";

const BrandSettings = () => {
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState<BrandData>({
    user_id: "",
    company_name: "",
    brand_type: "",
    description: "",
    website: null,
    instagram: null,
    location: "",
    phone_number: null,
    support_email: null,
    profile_image_url: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false
  });
  const { toast } = useToast();

  const handleUpdateField = async (field: string, value: any) => {
    setBrandData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <ProfileSettings
        brandData={{ ...brandData, loading }}
        onUpdateField={handleUpdateField}
      />
    </div>
  );
};

export default BrandSettings;