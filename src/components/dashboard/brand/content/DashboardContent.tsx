import QuickNotes from "../../notes/QuickNotes";
import CampaignFormContainer from "@/components/campaign/form/CampaignFormContainer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-white shadow-sm rounded-3xl overflow-hidden p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-nino-text mb-6 px-8">New Campaign</h3>
          <CampaignFormContainer />
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <QuickNotes />
      </motion.div>
    </div>
  );
};

export default DashboardContent;