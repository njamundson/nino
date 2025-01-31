import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import ProfileImageSection from "../../profile/ProfileImageSection";
import BrandProfileForm from "../BrandProfileForm";

interface BrandProfileSettingsProps {
  onBack: () => void;
}

const BrandProfileSettings = ({ onBack }: BrandProfileSettingsProps) => {
  const {
    loading,
    profileImage,
    brandData,
    setProfileImage,
    handleUpdateField,
    handleSave,
  } = useBrandSettings();

  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(brandData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    await handleSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Brand Profile</h1>
      </div>

      <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-8">
        <ProfileImageSection 
          profileImage={profileImage} 
          setProfileImage={setProfileImage}
        />

        <BrandProfileForm
          loading={loading}
          brandData={brandData}
          onUpdateField={handleUpdateField}
        />

        <div className="pt-6 border-t border-gray-100">
          <Button
            onClick={onSave}
            disabled={loading}
            className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-12 text-base font-medium transition-all duration-200 hover:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BrandProfileSettings;