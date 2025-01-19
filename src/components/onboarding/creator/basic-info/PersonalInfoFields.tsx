import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
}

const PersonalInfoFields = ({
  firstName,
  lastName,
  bio,
  location,
  onUpdateField,
}: PersonalInfoFieldsProps) => {
  const { toast } = useToast();
  const [locationInput, setLocationInput] = useState(location);
  const [suggestions, setSuggestions] = useState<Array<{ description: string }>>([]);
  const [open, setOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  const handleFullNameChange = (value: string) => {
    const firstSpaceIndex = value.indexOf(' ');
    let firstNameValue, lastNameValue;
    
    if (firstSpaceIndex === -1) {
      firstNameValue = value;
      lastNameValue = '';
    } else {
      firstNameValue = value.substring(0, firstSpaceIndex);
      lastNameValue = value.substring(firstSpaceIndex + 1);
    }
    
    onUpdateField("firstName", firstNameValue);
    onUpdateField("lastName", lastNameValue);
  };

  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { query },
      });

      if (error) {
        console.error('Location search error:', error);
        return;
      }

      if (data?.results) {
        const formattedSuggestions = data.results.map((result: any) => ({
          description: result.formatted,
        }));
        setSuggestions(formattedSuggestions);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Getting location",
      description: "Please wait while we fetch your location...",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('Getting coordinates:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });

          const { data, error } = await supabase.functions.invoke('geocode', {
            body: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });

          console.log('Geocoding response:', { data, error });

          if (error) {
            console.error('Supabase function error:', error);
            throw new Error(error.message || 'Failed to fetch location details');
          }

          if (!data) {
            throw new Error('No response from geocoding service');
          }

          if (data.results && data.results[0]) {
            const locationString = data.results[0].formatted.split(',').slice(1).join(',').trim();
            onUpdateField("location", locationString);
            setLocationInput(locationString);
            toast({
              title: "Success",
              description: "Location updated successfully",
            });
          } else {
            throw new Error('No location data found');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          toast({
            title: "Error",
            description: error.message || "Could not fetch location details",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Error",
          description: "Unable to retrieve your location",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-base">Full Name or Family Name *</Label>
        <Input
          id="fullName"
          value={`${firstName}${lastName ? ' ' + lastName : ''}`}
          onChange={(e) => handleFullNameChange(e.target.value)}
          placeholder="Enter your full name"
          className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-base">Location *</Label>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Input
                id="location"
                value={locationInput}
                onChange={(e) => handleLocationInputChange(e.target.value)}
                placeholder="Enter your location"
                className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base flex-1"
                required
              />
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => {
                        onUpdateField("location", suggestion.description);
                        setLocationInput(suggestion.description);
                        setOpen(false);
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {suggestion.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="outline"
            className="h-12 px-3"
            onClick={getLocation}
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">Bio *</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          className="bg-nino-bg border-transparent focus:border-nino-primary resize-none min-h-[120px] text-base"
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;