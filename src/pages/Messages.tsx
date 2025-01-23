import PageHeader from "@/components/shared/PageHeader";
import ChatList from "@/components/messages/ChatList";

const Messages = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators and brands."
      />
      <ChatList />
    </div>
  );
};

export default Messages;