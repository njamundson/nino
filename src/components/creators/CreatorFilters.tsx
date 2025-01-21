import { CreatorFiltersProps } from '@/types/creator';

const CreatorFilters = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
  onSpecialtyChange,
  onCreatorTypeChange,
  onLocationChange,
  onInvite
}: CreatorFiltersProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        {['Photography', 'Videography', 'Content Creation', 'Social Media Management', 'Influencer Marketing', 'Graphic Design', 'Writing', 'Music', 'Animation'].map((specialty) => (
          <button
            key={specialty}
            className={`px-4 py-2 rounded-full ${selectedSpecialties.includes(specialty) ? 'bg-nino-primary text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => onSpecialtyChange(specialty)}
          >
            {specialty}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Creator Type</label>
        <select
          value={selectedCreatorType || ''}
          onChange={(e) => onCreatorTypeChange(e.target.value || null)}
          className="mt-2 p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="solo">Solo</option>
          <option value="agency">Agency</option>
          <option value="brand">Brand</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Location</label>
        <input
          type="text"
          placeholder="Enter location"
          onChange={(e) => onLocationChange(e.target.value)}
          className="mt-2 p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default CreatorFilters;
