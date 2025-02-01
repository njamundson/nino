import { memo } from "react";
import PageHeader from "@/components/shared/PageHeader";

interface DashboardWelcomeProps {
  display_name?: string | null;
}

const DashboardWelcome = ({ display_name }: DashboardWelcomeProps) => {
  return (
    <PageHeader 
      title="Dashboard" 
      description={`Welcome back${display_name ? `, ${display_name}` : ''}! Here's an overview of your activity`}
    />
  );
};

export default memo(DashboardWelcome);