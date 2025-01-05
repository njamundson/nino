import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Plus, X } from "lucide-react";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
}

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const [showAddManager, setShowAddManager] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAccountManager = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newManager = {
      id: Date.now().toString(),
      name: formData.get("managerName") as string,
      email: formData.get("managerEmail") as string,
      role: formData.get("managerRole") as string,
    };
    setAccountManagers([...accountManagers, newManager]);
    setShowAddManager(false);
    form.reset();
  };

  const removeManager = (id: string) => {
    setAccountManagers(accountManagers.filter(manager => manager.id !== id));
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-xl shadow-sm"
      >
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-nino-primary rounded-full" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-nino-text">
            Complete your brand profile
          </h1>
          <p className="text-nino-gray">Tell us about your brand</p>
        </div>

        <div className="space-y-6">
          {/* Brand Logo Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImage || ""} />
                <AvatarFallback className="bg-nino-bg">
                  <Camera className="w-8 h-8 text-nino-gray" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 p-1 bg-nino-primary rounded-full cursor-pointer hover:bg-nino-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </label>
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-sm text-nino-gray">Upload your brand logo</p>
          </div>

          {/* Brand Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input id="brandName" placeholder="Enter your brand name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandEmail">Brand Email</Label>
              <Input id="brandEmail" type="email" placeholder="Enter brand email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandBio">Brand Bio</Label>
              <Textarea
                id="brandBio"
                placeholder="Tell us about your brand..."
                className="h-24"
              />
            </div>
          </div>

          {/* Account Managers */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Account Managers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddManager(true)}
                className="text-nino-primary border-nino-primary hover:bg-nino-primary hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Manager
              </Button>
            </div>

            {showAddManager && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-4 border rounded-lg bg-nino-bg"
                onSubmit={addAccountManager}
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input name="managerName" placeholder="Name" required />
                  <Input name="managerEmail" type="email" placeholder="Email" required />
                </div>
                <Input name="managerRole" placeholder="Role (e.g., Admin, Editor)" required />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddManager(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-nino-primary hover:bg-nino-primary/90 text-white"
                  >
                    Add
                  </Button>
                </div>
              </motion.form>
            )}

            <div className="space-y-2">
              {accountManagers.map((manager) => (
                <motion.div
                  key={manager.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 bg-nino-bg rounded-lg"
                >
                  <div>
                    <p className="font-medium text-nino-text">{manager.name}</p>
                    <p className="text-sm text-nino-gray">{manager.email}</p>
                    <p className="text-xs text-nino-primary">{manager.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeManager(manager.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            onClick={() => navigate("/onboarding")}
            variant="outline"
            className="text-nino-gray"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            Complete Profile
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandOnboarding;