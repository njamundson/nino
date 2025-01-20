import React, { useRef } from 'react';
import { Camera, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  uploadedImage: string | null;
  isUploading: boolean;
  onImageUpload: (file: File) => Promise<void>;
}

const ImageUpload = ({ uploadedImage, isUploading, onImageUpload }: ImageUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    await onImageUpload(file);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-2xl mx-auto">
      <div className="relative group cursor-pointer w-full">
        <div 
          className={`
            w-full aspect-video rounded-xl border-2 border-dashed
            flex items-center justify-center bg-white/50
            transition-all duration-300 ease-in-out
            group-hover:border-nino-primary/30 group-hover:bg-gray-50/50
            backdrop-blur-sm
            ${uploadedImage ? 'border-nino-primary/20 shadow-sm border-solid' : 'border-gray-200'}
            ${isUploading ? 'animate-pulse' : ''}
          `}
        >
          {uploadedImage ? (
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              <img 
                src={uploadedImage} 
                alt="Campaign" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white space-y-2">
                  <ImagePlus className="mx-auto w-6 h-6" />
                  <p className="text-sm font-medium">Change Image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 px-4 py-12">
              <Camera className="mx-auto h-8 w-8 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" />
              <div>
                <p className="text-sm font-medium text-gray-900">Upload Campaign Image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </div>
      {isUploading && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          <p className="text-sm text-gray-500">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;