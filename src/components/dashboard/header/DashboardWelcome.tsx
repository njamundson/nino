import { memo } from "react";
import PageHeader from "@/components/shared/PageHeader";

interface DashboardWelcomeProps {
  firstName?: string | null;
}

const DashboardWelcome = ({ firstName }: DashboardWelcomeProps) => {
  return (
    <PageHeader 
      title="Dashboard" 
      description={`Welcome back${firstName ? `, ${firstName}` : ''}! Here's an overview of your activity`}
    />
  );
};

export default memo(DashboardWelcome);