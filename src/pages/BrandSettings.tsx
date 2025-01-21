import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import BrandDetailsForm from "@/components/settings/profile/BrandDetailsForm";
import AccountManagersSection from "@/components/settings/profile/AccountManagersSection";
import { Button } from "@/components/ui/button";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { BrandData } from "@/types/brand";

type SettingsPage = "profile" | "managers" | "menu";

const BrandSettings = () => {
  const [currentPage, setCurrentPage] = useState<SettingsPage>("menu");
  const {
    loading,
    profileImage,
    brandData,
    setBrandData,
    setProfileImage,
    handleSave,
  } = useBrandSettings();

  const onUpdateField = (field: string, value: any) => {
    setBrandData((prev: BrandData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pages: Record<SettingsPage, React.ReactNode> = {
    profile: (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage("menu")}
            className="hover:bg-nino-accent/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">Brand Profile</h2>
        </div>
        <div className="bg-white/50 backdrop-blur-xl rounded-xl shadow-sm p-6">
          <BrandDetailsForm
            loading={loading}
            profileImage={profileImage}
            brandData={{
              brandName: brandData.company_name,
              brandEmail: brandData.support_email || "",
              brandBio: brandData.description,
              homeLocation: brandData.location,
              instagram: brandData.instagram || "",
              website: brandData.website || "",
              location: brandData.location,
              brandType: brandData.brand_type
            }}
            onUpdateField={onUpdateField}
            onUpdateImage={setProfileImage}
          />
          <div className="mt-6">
            <Button onClick={handleSave} disabled={loading}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    ),
    managers: (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage("menu")}
            className="hover:bg-nino-accent/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">Account Managers</h2>
        </div>
        <div className="bg-white/50 backdrop-blur-xl rounded-xl shadow-sm p-6">
          <AccountManagersSection />
        </div>
      </div>
    ),
    menu: null,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-nino-bg overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPage === "menu" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto pt-12 px-6"
          >
            <h1 className="text-3xl font-semibold text-nino-text mb-8">Brand Settings</h1>
            <div className="space-y-3">
              <SettingsButton
                label="Brand Profile"
                onClick={() => setCurrentPage("profile")}
              />
              <SettingsButton
                label="Account Managers"
                onClick={() => setCurrentPage("managers")}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full p-8"
          >
            {pages[currentPage]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full p-4 bg-white/50 backdrop-blur-xl rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
  >
    <span className="text-nino-text font-medium">{label}</span>
    <ChevronRight className="w-5 h-5 text-nino-gray group-hover:text-nino-text transition-colors" />
  </button>
);

export default BrandSettings;