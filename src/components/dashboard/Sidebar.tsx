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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/creator/dashboard" },
    { icon: Briefcase, label: "Projects", path: "/creator/projects" },
    { icon: FileText, label: "Proposals", path: "/creator/proposals" },
    { icon: Calendar, label: "Bookings", path: "/creator/bookings" },
    { icon: MessageSquare, label: "Messages", path: "/creator/messages" },
    { icon: CheckCircle, label: "Completed Projects", path: "/creator/completed-projects" },
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

  const handleNavigation = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="h-full bg-white flex flex-col rounded-3xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-gray-100/50">
      <div className="p-6 flex justify-start border-b border-gray-100/50">
        <img 
          src="/lovable-uploads/750e93fc-c7bd-41ae-bd2f-42877db3bd66.png" 
          alt="NINO" 
          className="h-16"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          style={{ imageRendering: 'crisp-edges' }}
        />
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
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="h-screen sticky top-0 w-64 p-4">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;