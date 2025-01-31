export const CREATOR_TYPES = ['solo', 'agency', 'brand'] as const;

export const CREATOR_SPECIALTIES = [
  'UGC Creator',
  'Videographer',
  'Photographer',
  'Model/Talent',
  'Public Relations/Writer'
] as const;

export const validateInstagramHandle = (handle: string): boolean => {
  const username = handle.startsWith('@') ? handle.slice(1) : handle;
  return /^[a-zA-Z0-9._]{1,30}$/.test(username);
};

export const validateWebsiteUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};