import PageHeader from "@/components/shared/PageHeader";
import { memo } from "react";

const ProjectsHeader = () => {
  return (
    <PageHeader
      title="Projects"
      description="Browse and apply to available projects from top brands"
    />
  );
};

export default memo(ProjectsHeader);