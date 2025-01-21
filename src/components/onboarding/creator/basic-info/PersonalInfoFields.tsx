import FullNameField from "./fields/FullNameField";
import LocationField from "./fields/LocationField";
import BioField from "./fields/BioField";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const PersonalInfoFields = ({
  firstName,
  lastName,
  bio,
  location,
  onUpdateField,
  required = false,
}: PersonalInfoFieldsProps) => {
  return (
    <>
      <FullNameField
        firstName={firstName}
        lastName={lastName}
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