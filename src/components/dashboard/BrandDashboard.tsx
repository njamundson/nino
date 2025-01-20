import { useState } from "react";
import DashboardHeader from "./header/DashboardHeader";
import CampaignForm from "../campaign/CampaignForm";
import QuickNotes from "./notes/QuickNotes";
import { Card } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BrandDashboard = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      console.log("Starting image upload...");
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to path:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log("Upload successful, getting public URL...");

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath);

      console.log("Public URL obtained:", publicUrl);

      setUploadedImage(publicUrl);
      toast({
        title: "Success",
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
    <div className="space-y-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm rounded-3xl overflow-hidden p-6">
          <h3 className="text-xl font-semibold text-nino-text mb-6">New Campaign</h3>
          <CampaignForm 
            uploadedImage={uploadedImage}
            isUploading={isUploading}
            onImageUpload={handleImageUpload}
          />
        </Card>
        <QuickNotes />
      </div>
    </div>
  );
};

export default BrandDashboard;