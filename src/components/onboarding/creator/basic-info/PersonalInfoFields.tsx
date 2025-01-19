import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
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
      setShowSuggestions(false);
      return;
    }

    try {
      console.log('Searching locations for query:', query);
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { query },
      });

      if (error) {
        console.error('Location search error:', error);
        toast({
          title: "Error searching locations",
          description: "Please try again later",
          variant: "destructive",
        });
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      console.log('Location search response:', data);

      if (data?.results) {
        const formattedSuggestions = data.results.map((result: any) => ({
          description: result.formatted,
        }));
        console.log('Formatted suggestions:', formattedSuggestions);
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      toast({
        title: "Error searching locations",
        description: "Please try again later",
        variant: "destructive",
      });
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    onUpdateField("location", value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
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
        <div className="relative">
          <Input
            id="location"
            value={locationInput}
            onChange={(e) => handleLocationInputChange(e.target.value)}
            placeholder="Start typing your location..."
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base w-full"
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <Command className="absolute w-full z-10 mt-1 bg-white rounded-md shadow-lg border border-gray-200">
              <CommandGroup>
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      onUpdateField("location", suggestion.description);
                      setLocationInput(suggestion.description);
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {suggestion.description}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}
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