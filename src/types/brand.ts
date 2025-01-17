export type BrandType = "hotel" | "resort" | "travel_agency";

export interface BrandData {
  brandName: string;
  brandEmail: string;
  brandType: BrandType;
  homeLocation: string;
  brandBio: string;
  instagram: string;
  website: string;
  location: string;
}