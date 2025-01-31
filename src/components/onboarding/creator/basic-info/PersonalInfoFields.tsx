import FullNameField from "./fields/FullNameField";
import LocationField from "./fields/LocationField";
import BioField from "./fields/BioField";

interface PersonalInfoFieldsProps {
  displayName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const PersonalInfoFields = ({
  displayName,
  bio,
  location,
  onUpdateField,
  required = false,
}: PersonalInfoFieldsProps) => {
  return (
    <>
      <FullNameField
        displayName={displayName}
        onUpdateField={onUpdateField}
      />

      <LocationField
        location={location}
        onUpdateField={onUpdateField}
      />

      <BioField
        bio={bio}
        onUpdateField={onUpdateField}
      />
    </>
  );
};

export default PersonalInfoFields;