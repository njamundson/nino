import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import SubscriptionSettings from "../../SubscriptionSettings";

const AccountSettings = () => {
  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    console.log("Account deletion requested");
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 px-6 pb-24">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Account & Subscription</h1>
      
      <div className="space-y-8">
        <SubscriptionSettings />

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-500">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
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
  );
};

export default AccountSettings;