export const formatDate = (date: string) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
  }
  return notificationDate.toLocaleDateString();
};