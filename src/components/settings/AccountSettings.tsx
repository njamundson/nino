import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AccountSettingsProps {
  onBack?: () => void;
}

const AccountSettings = ({ onBack }: AccountSettingsProps) => {
  return (
    <div className="max-w-2xl mx-auto pt-12 px-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
      )}
      
      <h2 className="text-2xl font-semibold mb-8">Account & Security</h2>
      
      <div className="space-y-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <p className="text-gray-600">user@example.com</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <p className="text-gray-600">Brand Account</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-600">January 1, 2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
            </div>
            <div>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Authentication
              </Button>
            </div>
            <div>
              <Button variant="outline" className="w-full justify-start">
                Manage Connected Devices
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;