import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import BasicInfoSettings from "@/components/settings/creator/pages/BasicInfoSettings";
import ProfessionalSettings from "@/components/settings/creator/pages/ProfessionalSettings";
import AccountSettings from "@/components/settings/creator/pages/AccountSettings";
import { Button } from "@/components/ui/button";

type SettingsPage = "basic" | "professional" | "account" | "menu";

const Settings = () => {
  const [currentPage, setCurrentPage] = useState<SettingsPage>("menu");

  const pages: Record<SettingsPage, React.ReactNode> = {
    basic: <BasicInfoSettings />,
    professional: <ProfessionalSettings />,
    account: <AccountSettings />,
    menu: null
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
            <h1 className="text-3xl font-semibold text-nino-text mb-8">Settings</h1>
            <div className="space-y-3">
              <SettingsButton
                label="Basic Information"
                onClick={() => setCurrentPage("basic")}
              />
              <SettingsButton
                label="Professional & Social"
                onClick={() => setCurrentPage("professional")}
              />
              <SettingsButton
                label="Account & Subscription"
                onClick={() => setCurrentPage("account")}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
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

export default Settings;