import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const messages = [
  {
    id: 1,
    sender: "John Doe",
    avatar: "/placeholder.svg",
    message: "Hey, I'd love to discuss the project details...",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    sender: "Alice Smith",
    avatar: "/placeholder.svg",
    message: "The photos look amazing! Can we schedule...",
    time: "5h ago",
    unread: false,
  },
];

export function MessagesSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Messages</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-nino-bg transition-colors"
          >
            <Avatar>
              <AvatarImage src={message.avatar} />
              <AvatarFallback>{message.sender[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{message.sender}</p>
                <span className="text-xs text-nino-gray">{message.time}</span>
              </div>
              <p className="text-sm text-nino-gray line-clamp-1">
                {message.message}
              </p>
            </div>
            {message.unread && (
              <div className="h-2 w-2 rounded-full bg-red-500" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}