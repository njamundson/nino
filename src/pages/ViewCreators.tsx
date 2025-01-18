import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorFilters from "@/components/creators/CreatorFilters";
import { useToast } from "@/hooks/use-toast";

const ViewCreators = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) => 
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleInvite = (creatorId: string) => {
    // This is a placeholder function that will be implemented later
    toast({
      title: "Success",
      description: "Creator has been invited.",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Browse Creators"
        description="Discover and connect with talented creators for your campaigns."
      />
      <CreatorFilters 
        selectedSpecialties={selectedSpecialties}
        onSpecialtyChange={handleSpecialtyChange}
      />
      <CreatorGrid 
        selectedSpecialties={selectedSpecialties} 
        onInvite={handleInvite}
      />
    </div>
  );
};

export default ViewCreators;