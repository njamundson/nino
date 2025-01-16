import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const Sidebar = () => {
  const location = useLocation();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: FileText, label: "Proposals", path: "/proposals" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-[#B4736E]">NINO</span>
          <span className="text-sm text-gray-500">Creator Portal</span>
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50",
                  location.pathname === item.path && "bg-gray-50 text-[#B4736E]"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 w-full text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;