import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import BrandDetailsForm from "@/components/settings/profile/BrandDetailsForm";
import ContactInformationForm from "@/components/settings/profile/ContactInformationForm";
import NotificationPreferences from "@/components/settings/profile/NotificationPreferences";
import SecuritySettings from "@/components/settings/profile/SecuritySettings";
import { Button } from "@/components/ui/button";
import { useBrandSettings } from "@/hooks/useBrandSettings";

type SettingsPage = "profile" | "contact" | "notifications" | "security" | "menu";

const BrandSettings = () => {
  const [currentPage, setCurrentPage] = useState<SettingsPage>("menu");
  const {
    loading,
    brandData,
    loginHistory,
    setBrandData,
    handleSave,
  } = useBrandSettings();

  const onUpdateField = (field: string, value: any) => {
    setBrandData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pages: Record<SettingsPage, React.ReactNode> = {
    profile: (
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold">Brand Profile</h2>
        <BrandDetailsForm
          brandData={brandData}
          loading={loading}
          onUpdateField={onUpdateField}
        />
        <Button onClick={handleSave} disabled={loading}>
          Save Changes
        </Button>
      </div>
    ),
    contact: (
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <ContactInformationForm
          brandData={brandData}
          loading={loading}
          onUpdateField={onUpdateField}
        />
        <Button onClick={handleSave} disabled={loading}>
          Save Changes
        </Button>
      </div>
    ),
    notifications: (
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold">Notification Settings</h2>
        <NotificationPreferences
          brandData={brandData}
          loading={loading}
          onUpdateField={onUpdateField}
        />
        <Button onClick={handleSave} disabled={loading}>
          Save Changes
        </Button>
      </div>
    ),
    security: (
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold">Security Settings</h2>
        <SecuritySettings
          brandData={brandData}
          loading={loading}
          loginHistory={loginHistory}
          onUpdateField={onUpdateField}
        />
        <Button onClick={handleSave} disabled={loading}>
          Save Changes
        </Button>
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
                label="Contact Information"
                onClick={() => setCurrentPage("contact")}
              />
              <SettingsButton
                label="Notification Preferences"
                onClick={() => setCurrentPage("notifications")}
              />
              <SettingsButton
                label="Security Settings"
                onClick={() => setCurrentPage("security")}
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
            <div className="fixed bottom-8 left-0 right-0 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setCurrentPage("menu")}
                className="bg-nino-white/80 backdrop-blur-xl border-0 shadow-lg hover:bg-nino-white/90 text-nino-text"
              >
                Back to Settings
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full p-4 bg-nino-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
  >
    <span className="text-nino-text font-medium">{label}</span>
    <ChevronRight className="w-5 h-5 text-nino-gray group-hover:text-nino-text transition-colors" />
  </button>
);

export default BrandSettings;