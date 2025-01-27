import { useMessageQueries } from "./messages/useMessageQueries";
import { useMessageActions } from "./messages/useMessageActions";
import { useMessageSubscription } from "./messages/useMessageSubscription";

export const useMessages = (userId: string) => {
  const { data, isLoading, error, setMessages } = useMessageQueries(userId);
  const {
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction
  } = useMessageActions(userId);

  useMessageSubscription(userId);

  return {
    data,
    setMessages,
    isLoading,
    error,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction
  };
};