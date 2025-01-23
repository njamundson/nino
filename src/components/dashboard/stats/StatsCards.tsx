import { useNewProposals } from "@/hooks/stats/useNewProposals";
import { useActiveBookings } from "@/hooks/stats/useActiveBookings";
import { useCompletedProjects } from "@/hooks/stats/useCompletedProjects";
import { Card } from "@/components/ui/card";
import { FileText, Calendar, CheckCircle } from "lucide-react";

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon 
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType;
}) => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-nino-primary/10 p-4">
        <Icon className="h-6 w-6 text-nino-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h4 className="text-2xl font-semibold">{value}</h4>
      </div>
    </div>
  </Card>
);

const StatsCards = () => {
  const newProposals = useNewProposals();
  const activeBookings = useActiveBookings();
  const completedProjects = useCompletedProjects();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="New Proposals"
        value={newProposals}
        icon={FileText}
      />
      <StatsCard
        title="Active Bookings"
        value={activeBookings}
        icon={Calendar}
      />
      <StatsCard
        title="Completed Projects"
        value={completedProjects}
        icon={CheckCircle}
      />
    </div>
  );
};

export default StatsCards;