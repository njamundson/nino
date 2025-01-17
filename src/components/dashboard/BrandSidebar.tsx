import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const BrandSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/brand/dashboard" },
    { icon: PlusCircle, label: "New Campaign", path: "/brand/campaigns/new" },
    { icon: List, label: "My Campaigns", path: "/brand/campaigns" },
    { icon: Users, label: "View Creators", path: "/brand/creators" },
    { icon: FileText, label: "Proposals", path: "/brand/proposals" },
    { icon: Calendar, label: "Bookings", path: "/brand/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/brand/messages" },
    { icon: Settings, label: "Settings", path: "/brand/settings" },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 p-4">
      <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
        <div className="p-6 border-b">
          <Link to="/brand/dashboard" className="flex items-center">
            <img 
              src="/lovable-uploads/96268c5e-175d-42ed-9c0e-7d11dbfff036.png" 
              alt="Nino" 
              className="h-16 w-auto"
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-nino-bg text-nino-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-3 mt-auto">
          <Link
            to="/auth/signin"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandSidebar;