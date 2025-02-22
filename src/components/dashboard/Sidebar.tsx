import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  Menu,
  LogOut,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useState, memo, useCallback } from "react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/creator/dashboard" },
  { icon: Briefcase, label: "Projects", path: "/creator/projects" },
  { icon: FileText, label: "Invitations", path: "/creator/proposals" },
  { icon: Send, label: "Applications", path: "/creator/applications" },
  { icon: Calendar, label: "Bookings", path: "/creator/bookings" },
  { icon: MessageSquare, label: "Messages", path: "/creator/messages" },
  { icon: CheckCircle, label: "Completed Projects", path: "/creator/completed-projects" },
];

// Memoized logo component to prevent unnecessary re-renders
const Logo = memo(() => (
  <img 
    src="/lovable-uploads/750e93fc-c7bd-41ae-bd2f-42877db3bd66.png" 
    alt="NINO" 
    className="h-16"
    loading="eager"
    fetchPriority="high"
    decoding="sync"
    style={{ 
      imageRendering: 'crisp-edges',
      willChange: 'transform'
    }}
  />
));

Logo.displayName = 'Logo';

const SidebarContent = memo(({ handleNavigation, location, handleSignOut }: any) => (
  <div className="h-full bg-white flex flex-col rounded-xl shadow-sm border border-gray-100/50">
    <div className="p-6 flex justify-start border-b border-gray-100/50">
      <Logo />
    </div>

    <nav className="flex-1 px-4 py-6 overflow-hidden">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={handleNavigation}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-nino-gray transition-all duration-200",
                "hover:bg-nino-primary/5 hover:text-nino-primary",
                location.pathname === item.path && "bg-nino-primary/10 text-nino-primary font-medium"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>

    <div className="p-4 mt-auto border-t border-gray-100/50">
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 w-full text-nino-gray hover:text-nino-primary hover:bg-nino-primary/5 rounded-xl transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm">Sign Out</span>
      </button>
    </div>
  </div>
));

SidebarContent.displayName = 'SidebarContent';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
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
  }, [navigate, toast]);

  const handleNavigation = useCallback(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-40 w-64 p-4"
            >
              <SidebarContent 
                handleNavigation={handleNavigation}
                location={location}
                handleSignOut={handleSignOut}
              />
            </motion.div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="h-screen sticky top-0 w-64 p-4">
      <SidebarContent 
        handleNavigation={handleNavigation}
        location={location}
        handleSignOut={handleSignOut}
      />
    </div>
  );
};

export default memo(Sidebar);