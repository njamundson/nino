import PageHeader from "@/components/shared/PageHeader";
import CreatorGrid from "@/components/creators/CreatorGrid";

const ViewCreators = () => {
  // Mock data for development
  const mockCreators = [
    {
      id: "1",
      bio: "Travel photographer and content creator",
      profile: {
        first_name: "Sarah",
        last_name: "Johnson"
      }
    },
    {
      id: "2",
      bio: "Lifestyle and fashion influencer",
      profile: {
        first_name: "Michael",
        last_name: "Chen"
      }
    },
    {
      id: "3",
      bio: "Food and culinary content specialist",
      profile: {
        first_name: "Emma",
        last_name: "Rodriguez"
      }
    }
  ];

  const isLoading = false; // We'll handle loading states later

  return (
    <div className="space-y-8">
      <PageHeader
        title="Browse Creators"
        description="Discover and connect with talented creators for your campaigns."
      />
      <CreatorGrid creators={mockCreators} isLoading={isLoading} />
    </div>
  );
};

export default ViewCreators;