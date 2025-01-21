import PageHeader from "@/components/shared/PageHeader";
import { useCompletedProjects } from "@/hooks/stats/useCompletedProjects";

const CompletedProjectsHeader = () => {
  const completedCount = useCompletedProjects();

  return (
    <PageHeader
      title="Completed Projects"
      description={`You have successfully completed ${completedCount} ${completedCount === 1 ? 'project' : 'projects'}`}
    />
  );
};

export default CompletedProjectsHeader;