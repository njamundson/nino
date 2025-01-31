import { useMessageQueries } from "./messages/useMessageQueries";
import { useMessageActions } from "./messages/useMessageActions";
import { useMessageSubscription } from "./messages/useMessageSubscription";

export const useMessages = (selectedChat: string) => {
  const { data, isLoading, error, setMessages } = useMessageQueries(selectedChat);
  const {
    newMessage,
    setNewMessage,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction
  } = useMessageActions(selectedChat);

  useMessageSubscription(selectedChat);

  return {
    data,
    setMessages,
    isLoading,
    error,
    newMessage,
    setNewMessage,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction
  };
};