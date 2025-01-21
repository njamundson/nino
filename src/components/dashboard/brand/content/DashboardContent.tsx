import { Card } from "@/components/ui/card";
import BrandStatsCards from "../stats/BrandStatsCards";
import RecentMessages from "../../messages/RecentMessages";
import QuickNotes from "../../notes/QuickNotes";

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <BrandStatsCards />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <RecentMessages />
        </Card>
        
        <Card className="p-6">
          <QuickNotes />
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;