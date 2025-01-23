import { LoadingSpinner } from "@/components/ui/loading-spinner";

const DashboardLoading = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
      </div>
    </div>
  );
};

export default DashboardLoading;