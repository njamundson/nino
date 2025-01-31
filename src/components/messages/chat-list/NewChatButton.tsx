import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreatorSelectionModal from "./CreatorSelectionModal";
import { useNavigate } from "react-router-dom";

const NewChatButton = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCreatorSelect = (
    userId: string,
    displayName: string,
    profileImage: string | null
  ) => {
    navigate(`/brand/messages?userId=${userId}`);
  };

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full bg-nino-primary hover:bg-nino-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Message
      </Button>

      <CreatorSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleCreatorSelect}
      />
    </>
  );
};

export default NewChatButton;