interface EmptyStateProps {
  isBrand?: boolean;
}

export const EmptyState = ({ isBrand = true }: EmptyStateProps) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {isBrand 
        ? "Start a conversation with a creator"
        : "No messages yet. Brands will contact you here."
      }
    </div>
  );
};