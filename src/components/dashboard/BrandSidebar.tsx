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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BrandSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-64 h-screen sticky top-0 p-4">
      <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
        <div className="p-6 border-b">
          <Link to="/brand/dashboard" className="flex items-center">
            <img 
              src="/lovable-uploads/9f6502bf-d41d-42d5-b425-985d947e9f6f.png" 
              alt="Nino" 
              className="h-8"
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-nino-bg text-nino-primary"
                  : "text-gray-600 hover:text-nino-primary hover:bg-nino-bg"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 mt-auto border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full text-gray-600 hover:text-nino-primary hover:bg-nino-bg"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandSidebar;