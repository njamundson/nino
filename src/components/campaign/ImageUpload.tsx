import { Camera, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  uploadedImage: string | null;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload = ({ uploadedImage, isUploading, onImageUpload }: ImageUploadProps) => {
  const { toast } = useToast();

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    onImageUpload(e);
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-12">
      <div className="relative group cursor-pointer transition-all duration-300">
        <div 
          className={`
            w-80 h-56 rounded-2xl border-2 border-dashed 
            flex items-center justify-center bg-white
            transition-all duration-300 ease-in-out
            group-hover:border-gray-400 group-hover:bg-gray-50
            ${uploadedImage ? 'border-green-500 shadow-lg' : 'border-gray-200'}
            ${isUploading ? 'animate-pulse' : ''}
          `}
        >
          {uploadedImage ? (
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <img 
                src={uploadedImage} 
                alt="Campaign" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <ImagePlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 px-6 transition-all duration-300 group-hover:scale-105">
              <Camera className="mx-auto h-12 w-12 text-gray-300 group-hover:text-gray-400 transition-colors duration-300" />
              <div>
                <p className="text-sm font-medium text-gray-900">Upload campaign image</p>
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x800px</p>
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
      </div>
      {isUploading && (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          <p className="text-sm text-gray-600 font-medium">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;