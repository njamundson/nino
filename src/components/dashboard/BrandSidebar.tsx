import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  PlusCircle, 
  Users, 
  Calendar, 
  MessageSquare,
  ClipboardCheck,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: 'Dashboard', href: '/brand/dashboard', icon: LayoutGrid },
  { name: 'New Campaign', href: '/brand/new-campaign', icon: PlusCircle },
  { name: 'My Campaigns', href: '/brand/campaigns', icon: ClipboardCheck },
  { name: 'View Creators', href: '/brand/creators', icon: Users },
  { name: 'Bookings', href: '/brand/bookings', icon: Calendar },
  { name: 'Messages', href: '/brand/messages', icon: MessageSquare },
  { name: 'Completed Projects', href: '/brand/completed-projects', icon: ClipboardCheck },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full w-64 p-3 bg-nino-bg lg:fixed lg:left-0 lg:top-0">
      <div className="h-[calc(100vh-1.5rem)] bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg flex flex-col border border-gray-100/50">
        <div className="px-3 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-gray-100/50">
          <Link to="/brand/dashboard" className="flex items-center px-4">
            <img 
              src="/lovable-uploads/b852de8f-a42e-4be7-88e2-d2a17634fb0f.png"
              alt="Nino"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-nino-primary/10 text-nino-primary"
                      : "text-nino-text/60 hover:text-nino-text hover:bg-gray-100"
                  )}
                >
                  <Icon size={20} className={cn(
                    "flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-nino-primary" : "text-gray-400"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-3 py-4 border-t border-gray-100/50">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-nino-text/60 hover:text-nino-text rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <LogOut size={20} className="text-gray-400" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;