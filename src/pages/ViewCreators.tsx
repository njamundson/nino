import PageHeader from "@/components/shared/PageHeader";
import CreatorGrid from "@/components/creators/CreatorGrid";

const ViewCreators = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Browse Creators"
        description="Discover and connect with talented creators for your campaigns."
      />
      <CreatorGrid />
    </div>
  );
};

export default ViewCreators;