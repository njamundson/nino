import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lock, LogOut, Trash2 } from "lucide-react";

const AccountSettings = () => {
  const { toast } = useToast();

  const handlePasswordChange = () => {
    toast({
      title: "Password reset email sent",
      description: "Check your email for instructions to reset your password.",
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
      <h3 className="text-xl font-semibold text-nino-text mb-6">Account</h3>
      
      <div className="space-y-6">
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-base font-medium text-nino-text mb-2">Security</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-sm">Current Password</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="current-password"
                  type="password"
                  className="bg-white/50"
                  placeholder="Enter current password"
                />
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handlePasswordChange}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full sm:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out of All Devices
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-base font-medium text-red-600 mb-2">Danger Zone</h4>
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
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
                  <AlertDialogAction
                    onClick={handleAccountDeletion}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccountSettings;