import { useMessages } from "@/hooks/useMessages";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const RecentMessages = () => {
  const { messages, isLoading } = useMessages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-nino-primary/5 p-2">
                <MessageSquare className="h-5 w-5 text-nino-primary" />
              </div>
              <h3 className="text-xl font-semibold text-nino-text">Recent Messages</h3>
            </div>
          </div>
          
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-nino-primary border-t-transparent" />
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-nino-text">
                          {message.sender_first_name} {message.sender_last_name}
                        </p>
                        <p className="text-sm text-nino-gray mt-1 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-nino-gray">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-nino-gray">No messages yet</p>
                <p className="text-sm text-nino-gray/70 mt-1">
                  Your recent messages will appear here
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentMessages;