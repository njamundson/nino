import PageHeader from "@/components/shared/PageHeader";
import ChatList from "@/components/messages/ChatList";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators and brands."
      />
      <ChatList isMobile={isMobile} />
    </div>
  );
};

export default Messages;