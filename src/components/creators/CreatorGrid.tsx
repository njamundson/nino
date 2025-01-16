import CreatorCard from "./CreatorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

const CreatorGrid = () => {
  // Dummy data for development
  const creators: Creator[] = [
    {
      id: "1",
      bio: "Travel and lifestyle photographer specializing in outdoor adventures and cultural experiences.",
      location: "New York, USA",
      specialties: ["Photography", "Travel"],
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
      specialties: ["Fashion", "Beauty"],
      profile: {
        first_name: "Michael",
        last_name: "Chen"
      },
      imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
    },
    {
      id: "3",
      bio: "Food photographer and recipe developer.",
      location: "Paris, France",
      specialties: ["Food", "Styling"],
      profile: {
        first_name: "Emma",
        last_name: "Rodriguez"
      },
      imageUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843"
    },
    {
      id: "4",
      bio: "Tech reviewer and digital lifestyle content creator.",
      location: "Tokyo, Japan",
      specialties: ["Tech", "Video"],
      profile: {
        first_name: "Alex",
        last_name: "Tanaka"
      },
      imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec871214838"
    },
    {
      id: "5",
      bio: "Fitness and wellness influencer helping people achieve their health goals.",
      location: "Sydney, Australia",
      specialties: ["Fitness", "Wellness"],
      profile: {
        first_name: "Jordan",
        last_name: "Smith"
      },
      imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
    }
  ];

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
};

export default CreatorGrid;