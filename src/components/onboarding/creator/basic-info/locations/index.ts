import { northAmericanCountries, statesByCountry as northAmericanStates } from './northAmerica';
import { southAmericanCountries, statesByCountry as southAmericanStates } from './southAmerica';
import { europeanCountries, statesByCountry as europeanStates, citiesByCountry } from './europe';
import { caribbeanCountries } from './caribbean';

// Export all countries as a single array for filters
export const LOCATIONS = [
  ...northAmericanCountries,
  ...southAmericanCountries,
  ...europeanCountries,
  ...caribbeanCountries
];

// Maintain backwards compatibility for PersonalInfoFields.tsx
export const COUNTRIES = LOCATIONS;

export const STATES_BY_COUNTRY = {
  ...northAmericanStates,
  ...southAmericanStates,
  ...europeanStates
};

export const CITIES_BY_COUNTRY = citiesByCountry;

export const COUNTRIES_WITH_CITIES = Object.keys(CITIES_BY_COUNTRY);