import BrandStatsCards from "./stats/BrandStatsCards";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import CampaignForm from "../campaign/CampaignForm";
import { Card } from "../ui/card";
import { useState } from "react";

const BrandDashboard = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Handle image upload logic here
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <BrandStatsCards />
      
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