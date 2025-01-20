import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";

interface CampaignFormProps {
  uploadedImage: string;
  isUploading: boolean;
  onImageUpload: (file: File) => Promise<void>;
}

const CampaignForm = ({ uploadedImage, isUploading, onImageUpload }: CampaignFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    requirements: [""],
    deliverables: [""],
    paymentDetails: "",
    compensationDetails: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data here
    try {
      // Submit form data to your API or database
      toast({
        description: "Campaign created successfully",
      });
      navigate("/creator/dashboard");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ImageUpload 
        uploadedImage={uploadedImage}
        isUploading={isUploading}
        onImageUpload={onImageUpload}
      />
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          id="startDate"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          id="endDate"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements</label>
        <textarea
          id="requirements"
          value={formData.requirements.join(", ")}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value.split(", ") })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">Deliverables</label>
        <textarea
          id="deliverables"
          value={formData.deliverables.join(", ")}
          onChange={(e) => setFormData({ ...formData, deliverables: e.target.value.split(", ") })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="paymentDetails" className="block text-sm font-medium text-gray-700">Payment Details</label>
        <input
          type="text"
          id="paymentDetails"
          value={formData.paymentDetails}
          onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="compensationDetails" className="block text-sm font-medium text-gray-700">Compensation Details</label>
        <input
          type="text"
          id="compensationDetails"
          value={formData.compensationDetails}
          onChange={(e) => setFormData({ ...formData, compensationDetails: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button type="submit" className="w-full bg-nino-primary text-white py-2 rounded-md">Create Campaign</button>
    </form>
  );
};

export default CampaignForm;
