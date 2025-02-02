import { Card } from "@/components/ui/card";
import { Send, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyProposalsProps {
  type: 'proposal' | 'application';
}

const EmptyProposals = ({ type }: EmptyProposalsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1]
      }}
    >
      <Card className="p-12">
        <div className="text-center space-y-4">
          {type === 'proposal' ? (
            <>
              <Send className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No pending invitations</h3>
              <p className="text-gray-500">
                You don't have any pending project invitations from brands yet.
                When brands invite you to collaborate, they'll appear here!
              </p>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No applications submitted</h3>
              <p className="text-gray-500">
                You haven't applied to any projects yet.
                Browse available projects and start applying!
              </p>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default EmptyProposals;