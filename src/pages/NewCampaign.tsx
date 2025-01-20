import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CampaignForm from "@/components/campaign/CampaignForm";
import { useToast } from "@/hooks/use-toast";

const NewCampaign = () => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath);

      setUploadedImage(publicUrl);
      
      toast({
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Create New Campaign</h1>
      <CampaignForm
        uploadedImage={uploadedImage}
        isUploading={isUploading}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default NewCampaign;