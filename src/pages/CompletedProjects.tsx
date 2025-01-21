import CompletedProjectsHeader from "@/components/projects/CompletedProjectsHeader";
import CompletedProjectsList from "@/components/projects/CompletedProjectsList";

const CompletedProjects = () => {
  return (
    <div className="space-y-6">
      <CompletedProjectsHeader />
      <CompletedProjectsList />
    </div>
  );
};

export default CompletedProjects;