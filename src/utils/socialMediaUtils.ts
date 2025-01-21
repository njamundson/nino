/**
 * Formats an Instagram username into a valid profile URL
 * Handles various input formats:
 * - Raw username (njamundson)
 * - Username with @ (@njamundson)
 * - Full URL (https://instagram.com/njamundson)
 */
export const formatInstagramUrl = (username: string | null): string | null => {
  if (!username) return null;
  
  // Clean up the username by removing:
  // 1. Leading/trailing whitespace
  // 2. @ symbol from start
  // 3. Trailing slashes
  // 4. Full URL if present
  const cleanUsername = username
    .trim()
    .replace(/^@/, '')
    .replace(/\/$/, '')
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '');
    
  return `https://www.instagram.com/${cleanUsername}/`;
};

/**
 * Formats a website URL ensuring it has the correct protocol
 */
export const formatWebsiteUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  const trimmedUrl = url.trim();
  return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
};