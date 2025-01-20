import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface BookingsCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

const BookingsCalendar = ({ selectedDate, onSelectDate }: BookingsCalendarProps) => {
  return (
    <Card className="p-6 w-full bg-white rounded-3xl">
      <h3 className="text-2xl font-semibold mb-6 px-2">Upcoming Bookings</h3>
      <div className="w-full flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="w-full max-w-[400px] p-4"
          classNames={{
            months: "space-y-4",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center gap-1",
            caption_label: "text-xl font-semibold",
            nav: "flex items-center gap-1",
            nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full flex items-center justify-center",
            table: "w-full border-collapse space-y-1",
            head_row: "flex justify-between",
            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.9rem]",
            row: "flex w-full mt-2 justify-between",
            cell: "relative p-0 text-center text-lg font-normal hover:bg-accent hover:text-accent-foreground rounded-full w-10 h-10 flex items-center justify-center",
            day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
            day_selected: "bg-nino-primary text-white hover:bg-nino-primary hover:text-white focus:bg-nino-primary focus:text-white",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </div>
    </Card>
  );
};

export default BookingsCalendar;