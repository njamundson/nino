interface DateDividerProps {
  date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
  return (
    <div className="sticky top-0 z-10 flex justify-center">
      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
        {date}
      </span>
    </div>
  );
};