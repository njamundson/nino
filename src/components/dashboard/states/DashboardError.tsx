import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DashboardError = () => {
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Error loading dashboard. Please try refreshing the page.
      </AlertDescription>
    </Alert>
  );
};

export default DashboardError;