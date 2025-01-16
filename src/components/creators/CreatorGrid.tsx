import { useState } from "react";
import CreatorCard from "./CreatorCard";
import CreatorFilters from "./CreatorFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

const CreatorGrid = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Dummy data for development
  const creators: Creator[] = [
    {
      id: "1",
      bio: "Travel and lifestyle content creator specializing in outdoor adventures and cultural experiences.",
      location: "New York, USA",
      specialties: ["UGC", "Photography"],
      instagram: "sarahjohnson",
      website: "https://sarahjohnson.com",
      profile: {
        first_name: "Sarah",
        last_name: "Johnson"
      },
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    {
      id: "2",
      bio: "Fashion and beauty content creator with a passion for sustainable style.",
      location: "London, UK",
      specialties: ["Model/Talent", "Photography"],
      instagram: "michaelchen",
      website: "https://michaelchen.co",
      profile: {
        first_name: "Michael",
        last_name: "Chen"
      },
      imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
    },
    {
      id: "3",
      bio: "Food and lifestyle content creator.",
      location: "Paris, France",
      specialties: ["UGC", "Videography"],
      instagram: "emmarodriguez",
      website: null,
      profile: {
        first_name: "Emma",
        last_name: "Rodriguez"
      },
      imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843"
    },
    {
      id: "4",
      bio: "Tech and lifestyle content creator.",
      location: "Tokyo, Japan",
      specialties: ["Videography", "Public Relations"],
      instagram: "alextanaka",
      website: "https://alextanaka.dev",
      profile: {
        first_name: "Alex",
        last_name: "Tanaka"
      },
      imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec871214838"
    },
    {
      id: "5",
      bio: "Fitness and wellness content creator helping people achieve their health goals.",
      location: "Sydney, Australia",
      specialties: ["Model/Talent", "UGC"],
      instagram: "jordansmith",
      website: "https://jordansmith.fit",
      profile: {
        first_name: "Jordan",
        last_name: "Smith"
      },
      imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
    }
  ];

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const filteredCreators = selectedSpecialties.length > 0
    ? creators.filter(creator =>
        creator.specialties?.some(specialty =>
          selectedSpecialties.includes(specialty)
        )
      )
    : creators;

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <Card className="p-6 rounded-xl">
        <div className="text-center text-muted-foreground">
          No verified creators found.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <CreatorFilters
        selectedSpecialties={selectedSpecialties}
        onSpecialtyChange={handleSpecialtyChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
};

export default CreatorGrid;