import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/brand/dashboard" },
    { icon: PlusCircle, label: "New Campaign", path: "/brand/campaign/new" },
    { icon: Users, label: "View Creators", path: "/brand/creators" },
    { icon: FileText, label: "Proposals", path: "/brand/proposals" },
    { icon: Calendar, label: "Bookings", path: "/brand/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/brand/messages" },
    { icon: Settings, label: "Settings", path: "/brand/settings" },
  ];

  return (
    <div className="w-64 m-4">
      <div className="h-full bg-white rounded-xl shadow-md flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/750e93fc-c7bd-41ae-bd2f-42877db3bd66.png" 
              alt="NINO" 
              className="h-16"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors",
                    location.pathname === item.path && "bg-gray-50 text-nino-primary font-medium"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 mt-auto border-t">
          <button
            onClick={() => {}} // We'll implement logout later
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;