import { memo } from "react";
import Goals from "../goals/Goals";
import QuickNotes from "../notes/QuickNotes";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardSections = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-6'}`}>
      <Goals />
      <QuickNotes />
    </div>
  );
};

export default memo(DashboardSections);