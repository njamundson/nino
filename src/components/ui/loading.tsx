import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
    </div>
  );
};