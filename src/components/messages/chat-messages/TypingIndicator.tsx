export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
      <div className="flex gap-1">
        <span className="opacity-60">●</span>
        <span className="opacity-80">●</span>
        <span>●</span>
      </div>
      Someone is typing...
    </div>
  );
};