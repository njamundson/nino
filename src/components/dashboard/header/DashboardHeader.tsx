import { memo } from 'react';
import UserMenu from './UserMenu';

const DashboardHeader = () => {
  return (
    <div className="flex justify-end items-center space-x-4 mb-8">
      <UserMenu />
    </div>
  );
};

export default memo(DashboardHeader);