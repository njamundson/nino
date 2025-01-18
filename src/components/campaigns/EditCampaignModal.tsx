import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import CampaignForm from "./modals/CampaignForm";

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
    start_date: string | null;
    end_date: string | null;
  };
}

const EditCampaignModal = ({ isOpen, onClose, campaign }: EditCampaignModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    requirements: campaign.requirements,
    location: campaign.location || "",
    payment_details: campaign.payment_details || "",
    compensation_details: campaign.compensation_details || "",
    start_date: campaign.start_date || null,
    end_date: campaign.end_date || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDateSelect = (field: 'start_date' | 'end_date') => (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date ? date.toISOString() : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          payment_details: formData.payment_details,
          compensation_details: formData.compensation_details,
          start_date: formData.start_date,
          end_date: formData.end_date,
        })
        .eq('id', campaign.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Edit Campaign</h2>
        <CampaignForm
          formData={formData}
          handleChange={handleChange}
          handleDateSelect={handleDateSelect}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default EditCampaignModal;