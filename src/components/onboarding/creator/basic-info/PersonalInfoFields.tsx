import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data: { GOOGLE_PLACES_API_KEY } } = await supabase
          .functions.invoke('get-google-places-key');
        setApiKey(GOOGLE_PLACES_API_KEY);
      } catch (error) {
        console.error('Error fetching Google Places API key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

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
          className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-base">Location *</Label>
        {!isLoading && apiKey && (
          <GooglePlacesAutocomplete
            apiKey={apiKey}
            selectProps={{
              value: { label: location, value: location },
              onChange: (newValue: any) => {
                onUpdateField("location", newValue?.label || '');
              },
              placeholder: "Enter your location",
              className: "bg-nino-bg",
              styles: {
                control: (provided) => ({
                  ...provided,
                  backgroundColor: 'var(--nino-bg)',
                  border: 'none',
                  height: '48px',
                  borderRadius: '0.375rem',
                }),
                input: (provided) => ({
                  ...provided,
                  color: 'var(--nino-text)',
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? 'var(--nino-primary)' : 'white',
                  color: state.isFocused ? 'white' : 'var(--nino-text)',
                }),
              },
            }}
          />
        )}
        {isLoading && (
          <Input
            value={location}
            disabled
            placeholder="Loading location search..."
            className="bg-nino-bg border-transparent h-12 text-base"
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
          className="bg-nino-bg border-transparent focus:border-nino-primary resize-none min-h-[120px] text-base"
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;