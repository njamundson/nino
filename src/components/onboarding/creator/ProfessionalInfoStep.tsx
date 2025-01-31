import { CreatorType, CreatorData } from '@/types/creator';

interface ProfessionalInfoStepProps {
  creatorType: CreatorType;
  skills: string[];
  onUpdateField: (field: keyof CreatorData, value: any) => void;
  onUpdateSkills: (skills: string[]) => void;
}

const ProfessionalInfoStep = ({
  creatorType,
  skills,
  onUpdateField,
  onUpdateSkills
}: ProfessionalInfoStepProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Professional Information</h2>
      <div className="mt-4">
        <label className="block text-sm font-medium">Creator Type</label>
        <select
          value={creatorType}
          onChange={(e) => onUpdateField('creator_type', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        >
          <option value="solo">Solo Creator</option>
          <option value="agency">Agency</option>
          <option value="brand">Brand</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium">Skills</label>
        <input
          type="text"
          value={skills.join(', ')}
          onChange={(e) => onUpdateSkills(e.target.value.split(',').map(skill => skill.trim()))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
          placeholder="Enter your skills, separated by commas"
        />
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
