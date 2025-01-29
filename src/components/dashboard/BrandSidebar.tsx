import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Users,
  Calendar,
  MessageSquare,
  LogOut,
  FileCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BrandSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/brand/dashboard" },
    { icon: PlusCircle, label: "New Campaign", path: "/brand/campaigns/new" },
    { icon: List, label: "My Campaigns", path: "/brand/campaigns" },
    { icon: Users, label: "View Creators", path: "/brand/creators" },
    { icon: Calendar, label: "Bookings", path: "/brand/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/brand/messages" },
    { icon: FileCheck, label: "Completed Projects", path: "/brand/completed-projects" },
  ];

  const handleSignOut = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('brandData');
        navigate('/');
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('brandData');
        navigate('/');
        return;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error in handleSignOut:", error);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('brandData');
      navigate('/');
      
      toast({
        title: "Sign out completed",
        description: "You have been logged out of your account.",
      });
    }
  };

  return (
    <div className="h-screen sticky top-0 w-64 p-2 sm:p-4 hidden lg:block">
      <div className="h-full bg-white backdrop-blur-xl rounded-xl shadow-sm flex flex-col border border-gray-100">
        <div className="px-3 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-gray-100">
          <Link to="/brand/dashboard" className="flex items-center px-4">
            <img 
              src="/lovable-uploads/9f6502bf-d41d-42d5-b425-985d947e9f6f.png" 
              alt="Nino" 
              className="h-12 sm:h-16"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              style={{ 
                imageRendering: 'crisp-edges',
                willChange: 'transform'
              }}
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-nino-primary/10 text-nino-primary"
                    : "text-nino-gray hover:text-nino-primary hover:bg-nino-primary/5"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
                  isActive
                    ? "text-nino-primary"
                    : "text-gray-400 group-hover:text-nino-primary"
                )} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium text-nino-gray hover:text-nino-primary hover:bg-nino-primary/5 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandSidebar;