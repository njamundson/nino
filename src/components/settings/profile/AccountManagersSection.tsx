import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ManagerForm from "@/components/onboarding/brand/managers/ManagerForm";
import ManagerList from "@/components/onboarding/brand/managers/ManagerList";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AccountManagersSection = () => {
  const [showAddManager, setShowAddManager] = useState(false);
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);
  const { toast } = useToast();

  const addAccountManager = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brandData) throw new Error("Brand not found");

      const { data: manager, error } = await supabase
        .from('brand_managers')
        .insert({
          brand_id: brandData.id,
          name: formData.get("managerName") as string,
          email: formData.get("managerEmail") as string,
          role: formData.get("managerRole") as string,
        })
        .select()
        .single();

      if (error) throw error;

      setAccountManagers([...accountManagers, manager as AccountManager]);
      setShowAddManager(false);
      form.reset();

      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeManager = async (id: string) => {
    try {
      const { error } = await supabase
        .from('brand_managers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccountManagers(accountManagers.filter(manager => manager.id !== id));
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            <p className="text-sm text-gray-500">
              Manage your team members and their roles
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="h-[400px] pr-4">
        <ManagerList
          managers={accountManagers}
          onRemoveManager={removeManager}
        />
      </ScrollArea>

      {showAddManager ? (
        <ManagerForm
          onSubmit={addAccountManager}
          onCancel={() => setShowAddManager(false)}
        />
      ) : (
        <Button
          onClick={() => setShowAddManager(true)}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
          variant="outline"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </Button>
      )}
    </Card>
  );
};

export default AccountManagersSection;