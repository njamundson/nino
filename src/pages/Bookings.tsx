import PageHeader from "@/components/shared/PageHeader";
import BookingsList from "@/components/bookings/BookingsList";

const Bookings = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Bookings"
        description="Manage your upcoming and past bookings."
      />
      <BookingsList />
    </div>
  );
};

export default Bookings;