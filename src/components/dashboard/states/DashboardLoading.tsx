import { LoadingSpinner } from "@/components/ui/loading-spinner";

const DashboardLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default DashboardLoading;