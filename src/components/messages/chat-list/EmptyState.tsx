interface EmptyStateProps {
  searchQuery: string;
}

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
      <div className="text-gray-500">
        {searchQuery ? (
          <>
            <p className="text-lg font-medium">No results found</p>
            <p className="mt-1">Try adjusting your search terms</p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="mt-1">Your conversations will appear here</p>
          </>
        )}
      </div>
    </div>
  );
};