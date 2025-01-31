import ProfileImageUpload from "./basic-info/ProfileImageUpload";
import PersonalInfoFields from "./basic-info/PersonalInfoFields";

interface BasicInfoStepProps {
  profileImage: string | null;
  displayName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  onUpdateImage: (image: string | null) => void;
}

const BasicInfoStep = ({
  profileImage,
  displayName,
  bio,
  location,
  onUpdateField,
  onUpdateImage,
}: BasicInfoStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">
          Complete your profile
        </h1>
        <p className="text-nino-gray text-sm">Tell us more about yourself</p>
      </div>

      <ProfileImageUpload 
        profileImage={profileImage} 
        onUpdateImage={onUpdateImage} 
      />

      <PersonalInfoFields
        displayName={displayName}
        bio={bio}
        location={location}
        onUpdateField={onUpdateField}
        required={true}
      />
    </div>
  );
};

export default BasicInfoStep;