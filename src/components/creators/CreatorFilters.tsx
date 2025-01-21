import { CreatorFiltersProps } from "@/types/creator";

const CreatorFilters = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
  onInvite
}: CreatorFiltersProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Filter Creators</h2>
      
      <div className="flex flex-wrap gap-2">
        {selectedSpecialties.map((specialty) => (
          <span key={specialty} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
            {specialty}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedLocations.map((location) => (
          <span key={location} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
            {location}
          </span>
        ))}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium">Creator Type</label>
        <select
          value={selectedCreatorType}
          onChange={(e) => onInvite(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="solo">Solo</option>
          <option value="agency">Agency</option>
          <option value="brand">Brand</option>
        </select>
      </div>
    </div>
  );
};

export default CreatorFilters;
