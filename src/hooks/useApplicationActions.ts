import { useState } from "react";
import { toast } from "sonner";

interface UseApplicationActionsProps {
  opportunityId: string;
}

export const useApplicationActions = ({ opportunityId }: UseApplicationActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptApplication = async () => {
    toast.error("Application acceptance is currently unavailable");
    return false;
  };

  const handleRejectApplication = async () => {
    toast.error("Application rejection is currently unavailable");
    return false;
  };

  return {
    isProcessing,
    handleAcceptApplication,
    handleRejectApplication
  };
};