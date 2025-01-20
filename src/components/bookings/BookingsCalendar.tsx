import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface BookingsCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

const BookingsCalendar = ({ selectedDate, onSelectDate }: BookingsCalendarProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Upcoming Bookings</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md border"
      />
    </Card>
  );
};

export default BookingsCalendar;