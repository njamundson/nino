import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import SubscriptionSettings from "../../SubscriptionSettings";

interface AccountSettingsProps {
  onBack: () => void;
}

const AccountSettings = ({ onBack }: AccountSettingsProps) => {
  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    console.log("Account deletion requested");
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-nino-bg">
      <div className="max-w-2xl mx-auto pt-12 px-6 pb-24">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-semibold text-nino-text">Account & Subscription</h1>
        </div>
        
        <div className="space-y-8">
          <SubscriptionSettings />

          <div className="bg-nino-white rounded-2xl p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)]">
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-red-600">Danger Zone</h2>
              <p className="text-sm text-nino-gray">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;