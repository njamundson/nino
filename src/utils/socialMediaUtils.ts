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
 * Handles various input formats:
 * - Raw domain (example.com)
 * - Protocol without www (http://example.com)
 * - Full URL (https://www.example.com)
 */
export const formatWebsiteUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  let formattedUrl = url.trim().toLowerCase();
  
  // Remove trailing slashes
  formattedUrl = formattedUrl.replace(/\/+$/, '');
  
  // If the URL doesn't start with a protocol, add https://
  if (!formattedUrl.match(/^https?:\/\//i)) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  try {
    // Validate the URL format
    new URL(formattedUrl);
    return formattedUrl;
  } catch (e) {
    console.error('Invalid URL format:', url);
    return null;
  }
};