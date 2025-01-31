export const CREATOR_SPECIALTIES = [
  "Photography",
  "Videography",
  "Content Creation",
  "Social Media",
  "Blogging",
  "Vlogging",
  "Writing",
  "Graphic Design",
  "Web Design",
  "Animation",
  "Music",
  "Podcasting",
  "Streaming",
  "Gaming",
  "Fashion",
  "Beauty",
  "Fitness",
  "Food",
  "Travel",
  "Lifestyle",
  "Tech",
  "Business",
  "Education",
  "Entertainment"
] as const;

export const CREATOR_TYPES = ["solo", "agency", "brand"] as const;

export const validateInstagramHandle = (handle: string): boolean => {
  const instagramRegex = /^@?[a-zA-Z0-9._]{1,30}$/;
  return instagramRegex.test(handle);
};

export const validateWebsiteUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};