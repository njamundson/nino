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
}

const CreatorGrid = () => {
  // Dummy data for development
  const creators: Creator[] = [
    {
      id: "1",
      bio: "Travel and lifestyle photographer specializing in outdoor adventures and cultural experiences. Always seeking the next great story to tell through my lens.",
      location: "New York, USA",
      specialties: ["Photography", "Travel Content", "Storytelling"],
      profile: {
        first_name: "Sarah",
        last_name: "Johnson"
      }
    },
    {
      id: "2",
      bio: "Fashion and beauty content creator with a passion for sustainable style. Helping brands tell their story through authentic and engaging content.",
      location: "London, UK",
      specialties: ["Fashion", "Beauty", "Sustainable Living"],
      profile: {
        first_name: "Michael",
        last_name: "Chen"
      }
    },
    {
      id: "3",
      bio: "Food photographer and recipe developer. Creating mouthwatering content that makes people stop scrolling and start cooking.",
      location: "Paris, France",
      specialties: ["Food Photography", "Recipe Development", "Styling"],
      profile: {
        first_name: "Emma",
        last_name: "Rodriguez"
      }
    },
    {
      id: "4",
      bio: "Tech reviewer and digital lifestyle content creator. Bringing the latest gadgets and innovations to life through engaging video content.",
      location: "Tokyo, Japan",
      specialties: ["Tech Reviews", "Video Production", "Digital Content"],
      profile: {
        first_name: "Alex",
        last_name: "Tanaka"
      }
    },
    {
      id: "5",
      bio: "Fitness and wellness influencer helping people achieve their health goals through practical and sustainable methods.",
      location: "Sydney, Australia",
      specialties: ["Fitness", "Wellness", "Lifestyle"],
      profile: {
        first_name: "Jordan",
        last_name: "Smith"
      }
    }
  ];

  const isLoading = false;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
};

export default CreatorGrid;