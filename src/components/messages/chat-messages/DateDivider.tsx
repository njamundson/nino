interface DateDividerProps {
  date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <div className="flex justify-center mb-4">
      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
        {date}
      </span>
    </div>
  );
};