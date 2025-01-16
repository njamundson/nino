import { Card } from "@/components/ui/card";

const Messages = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-nino-text">Messages</h1>
      </div>
      
      <Card className="p-8 bg-white rounded-xl shadow-sm">
        <div className="text-center text-nino-gray">
          <p>No messages yet</p>
        </div>
      </Card>
    </div>
  );
};

export default Messages;