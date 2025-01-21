import { NotificationPopover } from './NotificationPopover';
import { UserMenu } from './UserMenu';

const DashboardHeader = () => {
  return (
    <div className="flex justify-end items-center space-x-4 mb-8">
      <NotificationPopover />
      <UserMenu />
    </div>
  );
};

export default DashboardHeader;