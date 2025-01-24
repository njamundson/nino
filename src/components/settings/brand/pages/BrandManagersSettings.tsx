import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Users } from "lucide-react";
import ManagerForm from "@/components/onboarding/brand/managers/ManagerForm";
import ManagerList from "@/components/onboarding/brand/managers/ManagerList";
import { useAccountManagers } from "@/components/onboarding/brand/managers/hooks/useAccountManagers";

const BrandManagersSettings = () => {
  const {
    showAddManager,
    setShowAddManager,
    accountManagers,
    addAccountManager,
    removeManager,
  } = useAccountManagers();

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
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

      <div className={accountManagers.length > 0 ? "h-[400px]" : "h-auto"}>
        {accountManagers.length > 0 ? (
          <ScrollArea className="pr-4">
            <ManagerList
              managers={accountManagers}
              onRemoveManager={removeManager}
            />
          </ScrollArea>
        ) : (
          <ManagerList
            managers={accountManagers}
            onRemoveManager={removeManager}
          />
        )}
      </div>

      {showAddManager ? (
        <ManagerForm
          onSubmit={addAccountManager}
          onCancel={() => setShowAddManager(false)}
        />
      ) : (
        <Button
          onClick={() => setShowAddManager(true)}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 mt-4"
          variant="outline"
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </Button>
      )}
    </Card>
  );
};

export default BrandManagersSettings;