import { useActiveBookings } from "@/hooks/stats/useActiveBookings";
import { useNewProposals } from "@/hooks/stats/useNewProposals";
import { useCompletedProjects } from "@/hooks/stats/useCompletedProjects";

export const useStatsData = () => {
  const activeProjects = useActiveBookings();
  const newProposals = useNewProposals();
  const completedProjects = useCompletedProjects();

  return {
    activeProjects,
    newProposals,
    completedProjects
  };
};