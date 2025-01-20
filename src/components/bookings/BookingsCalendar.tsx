import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface BookingsCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

const BookingsCalendar = ({ selectedDate, onSelectDate }: BookingsCalendarProps) => {
  return (
    <Card className="p-4 md:p-6 w-full">
      <h3 className="text-lg font-medium mb-4">Upcoming Bookings</h3>
      <div className="w-full flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border w-full max-w-[350px]"
        />
      </div>
    </Card>
  );
};

export default BookingsCalendar;