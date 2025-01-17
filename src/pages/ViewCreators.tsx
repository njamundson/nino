import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorFilters from "@/components/creators/CreatorFilters";

const ViewCreators = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) => 
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
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
      <CreatorGrid selectedSpecialties={selectedSpecialties} />
    </div>
  );
};

export default ViewCreators;