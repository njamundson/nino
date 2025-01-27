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
import { motion } from "framer-motion";

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
    <div className="h-screen sticky top-0 w-64 p-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="h-full bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100/50 overflow-hidden"
      >
        <div className="px-3 pt-8 pb-6 border-b border-gray-100/50">
          <Link to="/brand/dashboard" className="flex items-center px-4">
            <motion.img 
              src="/lovable-uploads/9f6502bf-d41d-42d5-b425-985d947e9f6f.png" 
              alt="Nino" 
              className="h-16"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-nino-primary/20 to-nino-primary/5 text-nino-primary"
                      : "text-gray-600 hover:text-nino-primary hover:bg-gradient-to-r hover:from-nino-primary/10 hover:to-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "w-[18px] h-[18px] transition-colors duration-300",
                    isActive
                      ? "text-nino-primary"
                      : "text-gray-400 group-hover:text-nino-primary"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-gray-100/50 bg-gradient-to-b from-transparent to-gray-50/30">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-nino-primary hover:bg-gradient-to-r hover:from-nino-primary/10 hover:to-transparent transition-all duration-300"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandSidebar;
