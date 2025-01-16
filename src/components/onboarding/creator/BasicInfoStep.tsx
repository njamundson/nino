import ProfileImageUpload from "./basic-info/ProfileImageUpload";
import PersonalInfoFields from "./basic-info/PersonalInfoFields";

interface BasicInfoStepProps {
  profileImage: string | null;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  onUpdateImage: (image: string | null) => void;
  errors: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    profileImage?: string;
  };
}

const BasicInfoStep = ({
  profileImage,
  firstName,
  lastName,
  bio,
  location,
  onUpdateField,
  onUpdateImage,
  errors,
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
        error={errors.profileImage} 
      />

      <PersonalInfoFields
        firstName={firstName}
        lastName={lastName}
        bio={bio}
        location={location}
        onUpdateField={onUpdateField}
        errors={errors}
      />
    </div>
  );
};

export default BasicInfoStep;