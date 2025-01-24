import PageHeader from "@/components/shared/PageHeader";
import { memo } from "react";

const ProjectsHeader = memo(() => {
  return (
    <PageHeader
      title="Projects"
      description="Browse and apply to available projects from top brands"
    />
  );
});

ProjectsHeader.displayName = "ProjectsHeader";

export default ProjectsHeader;