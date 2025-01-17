import { useEffect, useState } from "react";
import CreatorCard from "./CreatorCard";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

interface CreatorGridProps {
  selectedSpecialties: string[];
}

const CreatorGrid = ({ selectedSpecialties }: CreatorGridProps) => {
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data for testing
    const dummyCreators: CreatorData[] = [
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        bio: 'Travel photographer and content creator specializing in luxury hotels and resorts',
        specialties: ['Photography', 'Luxury Travel'],
        instagram: '@sarahtravels',
        website: 'www.sarahjohnson.com',
        location: 'Los Angeles, CA',
        paymentDetails: '',
        profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        profile: {
          first_name: 'Sarah',
          last_name: 'Johnson'
        }
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        bio: 'Adventure photographer and storyteller capturing moments around the world',
        specialties: ['Adventure', 'Videography'],
        instagram: '@michaelchenphoto',
        website: 'www.michaelchen.co',
        location: 'New York, NY',
        paymentDetails: '',
        profileImage: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
        profile: {
          first_name: 'Michael',
          last_name: 'Chen'
        }
      },
      {
        id: '3',
        firstName: 'Emma',
        lastName: 'Wilson',
        bio: 'Food and lifestyle content creator with a passion for sustainable travel',
        specialties: ['Food', 'Lifestyle'],
        instagram: '@emmaeats',
        website: 'www.emmawilson.com',
        location: 'London, UK',
        paymentDetails: '',
        profileImage: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
        profile: {
          first_name: 'Emma',
          last_name: 'Wilson'
        }
      },
      {
        id: '4',
        firstName: 'Alex',
        lastName: 'Rivera',
        bio: 'Travel vlogger specializing in off-the-beaten-path destinations',
        specialties: ['Travel', 'Vlogging'],
        instagram: '@alexexplores',
        website: 'www.alexrivera.travel',
        location: 'Miami, FL',
        paymentDetails: '',
        profileImage: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
        profile: {
          first_name: 'Alex',
          last_name: 'Rivera'
        }
      },
      {
        id: '5',
        firstName: 'Sofia',
        lastName: 'Patel',
        bio: 'Luxury hotel reviewer and social media consultant',
        specialties: ['Hotels', 'Social Media'],
        instagram: '@sofiastays',
        website: 'www.sofiapatel.com',
        location: 'Dubai, UAE',
        paymentDetails: '',
        profileImage: 'https://images.unsplash.com/photo-1501286353178-1ec881214838',
        profile: {
          first_name: 'Sofia',
          last_name: 'Patel'
        }
      }
    ];

    const fetchCreators = async () => {
      setLoading(true);
      try {
        // For testing, we'll use the dummy data instead of the actual API call
        const filteredCreators = selectedSpecialties.length > 0
          ? dummyCreators.filter(creator => 
              creator.specialties?.some(specialty => 
                selectedSpecialties.includes(specialty)
              )
            )
          : dummyCreators;
        
        setCreators(filteredCreators);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [selectedSpecialties]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          No creators found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator, index) => (
        <CreatorCard key={creator.id || index} creator={creator} />
      ))}
    </div>
  );
};

export default CreatorGrid;