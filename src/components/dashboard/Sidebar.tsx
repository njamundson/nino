import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle,
  Menu
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
    <div className="h-full bg-white rounded-xl shadow-md flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/750e93fc-c7bd-41ae-bd2f-42877db3bd66.png" 
            alt="NINO" 
            className="h-16"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-hidden">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleNavigation}
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