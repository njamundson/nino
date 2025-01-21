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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage("menu")}
            className="hover:bg-black/5 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Brand Profile
          </h2>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-8">
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
          <div className="mt-8">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white rounded-full py-6 transition-all duration-200 hover:scale-[0.98]"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    ),
    managers: (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage("menu")}
            className="hover:bg-black/5 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Account Managers
          </h2>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-8">
          <AccountManagersSection />
        </div>
      </div>
    ),
    menu: null,
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white overflow-hidden px-6">
      <AnimatePresence mode="wait">
        {currentPage === "menu" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto pt-12"
          >
            <h1 className="text-4xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8">
              Settings
            </h1>
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
            className="h-full py-8"
          >
            {pages[currentPage]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 0.985 }}
    onClick={onClick}
    className="w-full p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group border border-gray-200/50"
  >
    <span className="text-lg text-gray-800 font-medium">{label}</span>
    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
  </motion.button>
);

export default BrandSettings;