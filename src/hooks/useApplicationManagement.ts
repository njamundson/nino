import { useState } from "react";
import { toast } from "sonner";

export const useApplicationManagement = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdateStatus = async () => {
    toast.error("Application management is currently unavailable");
    return false;
  };

  return {
    isProcessing,
    handleUpdateStatus
  };
};