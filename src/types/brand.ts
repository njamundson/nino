export type BrandType = "hotel" | "resort" | "travel_agency";

export interface BrandData {
  brandName: string;
  brandEmail: string;
  brandBio: string;
  homeLocation: string;
  instagram: string;
  website: string;
  location: string;
  brandType: BrandType;
}