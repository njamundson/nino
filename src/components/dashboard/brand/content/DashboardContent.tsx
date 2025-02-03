import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSections from "../../sections/DashboardSections";
import RecentMessages from "../../messages/RecentMessages";

const DashboardContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-8 ${isMobile ? 'px-0' : ''}`}>
      <DashboardSections />
      <div className={isMobile ? 'px-4' : ''}>
        <RecentMessages />
      </div>
    </div>
  );
};

export default DashboardContent;