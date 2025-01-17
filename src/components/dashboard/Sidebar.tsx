import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/creator/dashboard" },
    { icon: Briefcase, label: "View Projects", path: "/creator/projects" },
    { icon: FileText, label: "Proposals", path: "/creator/proposals" },
    { icon: Calendar, label: "Bookings", path: "/creator/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/creator/messages" },
    { icon: Settings, label: "Settings", path: "/creator/settings" },
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 m-4">
      <div className="h-full bg-white rounded-xl shadow-md flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/750e93fc-c7bd-41ae-bd2f-42877db3bd66.png" 
              alt="NINO" 
              className="h-16"
            />
          </div>
        </div>

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

        <div className="p-4 mt-auto border-t">
          <button
            onClick={handleSignOut}
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