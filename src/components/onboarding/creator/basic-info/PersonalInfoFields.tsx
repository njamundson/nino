import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  
  const handleFullNameChange = (value: string) => {
    const firstSpaceIndex = value.indexOf(' ');
    let firstNameValue, lastNameValue;
    
    if (firstSpaceIndex === -1) {
      // No space found, entire value is first name
      firstNameValue = value;
      lastNameValue = '';
    } else {
      // Split at first space
      firstNameValue = value.substring(0, firstSpaceIndex);
      lastNameValue = value.substring(firstSpaceIndex + 1);
    }
    
    onUpdateField("firstName", firstNameValue);
    onUpdateField("lastName", lastNameValue);
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

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY&language=en`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            const locationString = data.results[0].formatted.split(',').slice(1).join(',').trim();
            onUpdateField("location", locationString);
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not fetch location details",
            variant: "destructive",
          });
        }
      },
      () => {
        toast({
          title: "Error",
          description: "Unable to retrieve your location",
          variant: "destructive",
        });
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
          <Input
            id="location"
            value={location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            placeholder="Enter your location"
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base flex-1"
            required
          />
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