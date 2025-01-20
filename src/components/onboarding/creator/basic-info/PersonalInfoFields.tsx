import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Places API key...');
        const { data, error } = await supabase.functions.invoke('get-google-places-key', {
          method: 'GET'
        });

        if (error) {
          console.error('Error fetching Google Places API key:', error);
          toast({
            title: "Error loading location search",
            description: "Please try again or enter location manually",
            variant: "destructive",
          });
          throw error;
        }

        if (data?.GOOGLE_PLACES_API_KEY) {
          console.log('API key retrieved successfully');
          setApiKey(data.GOOGLE_PLACES_API_KEY);
          
          // Load Google Places script
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${data.GOOGLE_PLACES_API_KEY}&libraries=places`;
          script.async = true;
          script.onload = () => {
            console.log('Google Places script loaded successfully');
            setScriptLoaded(true);
          };
          script.onerror = () => {
            console.error('Error loading Google Places script');
            toast({
              title: "Error",
              description: "Failed to load location search. Please enter location manually.",
              variant: "destructive",
            });
          };
          document.head.appendChild(script);
        } else {
          console.error('No API key in response:', data);
          toast({
            title: "Configuration error",
            description: "Location search is temporarily unavailable",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in fetchApiKey:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();

    // Cleanup function to remove the script
    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [toast]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-base">Full Name or Family Name *</Label>
        <Input
          id="fullName"
          value={`${firstName}${lastName ? ' ' + lastName : ''}`}
          onChange={(e) => {
            const fullName = e.target.value;
            const parts = fullName.split(' ');
            onUpdateField('firstName', parts[0] || '');
            onUpdateField('lastName', parts.slice(1).join(' '));
          }}
          placeholder="Enter your full name"
          className="bg-nino-bg border-transparent focus:border-transparent h-12 text-base shadow-sm hover:shadow focus:shadow"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-base">Location *</Label>
        {!isLoading && apiKey && scriptLoaded ? (
          <div className="relative">
            <GooglePlacesAutocomplete
              apiKey={apiKey}
              selectProps={{
                value: location ? { label: location, value: location } : null,
                onChange: (newValue: any) => {
                  onUpdateField("location", newValue?.label || '');
                },
                placeholder: "Enter your location",
                styles: {
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--nino-bg)',
                    border: '1px solid transparent',
                    minHeight: '48px',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    '&:hover': {
                      border: '1px solid transparent',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                    '&:focus-within': {
                      border: '1px solid transparent',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      outline: 'none',
                      ring: 'none',
                    }
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: '#282828',
                    fontSize: '1rem',
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#A55549' : 'white',
                    color: state.isFocused ? 'white' : '#282828',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    '&:hover': {
                      backgroundColor: '#A55549',
                      color: 'white',
                    },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    border: '1px solid transparent',
                    borderRadius: '0.375rem',
                    marginTop: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#737373',
                  }),
                },
                classNames: {
                  control: () => "bg-nino-bg border-transparent focus:border-transparent focus:ring-0",
                },
              }}
            />
          </div>
        ) : (
          <Input
            value={location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            placeholder={isLoading ? "Loading location search..." : "Enter your location"}
            className="bg-nino-bg border-transparent focus:border-transparent h-12 text-base shadow-sm hover:shadow focus:shadow"
            disabled={isLoading}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">Bio *</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          className="bg-nino-bg border-transparent focus:border-transparent resize-none min-h-[120px] text-base shadow-sm hover:shadow focus:shadow"
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;