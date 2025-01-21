import { Card } from "@/components/ui/card";
import NotificationPopover from "./NotificationPopover";
import UserMenu from "./UserMenu";

const DashboardHeader = () => {
  return (
    <Card className="mb-6 p-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-0 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg md:text-xl font-semibold text-nino-text">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <NotificationPopover />
        <UserMenu />
      </div>
    </Card>
  );
};

export default DashboardHeader;