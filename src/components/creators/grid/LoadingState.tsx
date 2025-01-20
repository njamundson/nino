const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="h-96 bg-gray-100 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
};

export default LoadingState;