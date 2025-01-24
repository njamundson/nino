import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BrandLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Prefetch data for other pages
  useEffect(() => {
    const prefetchData = async () => {
      console.log("Prefetching data for other pages...");

      // Prefetch creators data
      await queryClient.prefetchQuery({
        queryKey: ['creators'],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('creators')
            .select(`
              id,
              first_name,
              last_name,
              bio,
              location,
              specialties,
              creator_type,
              instagram,
              website,
              profile_image_url
            `)
            .eq('onboarding_completed', true);

          if (error) throw error;
          return data;
        }
      });

      // Prefetch campaigns data
      await queryClient.prefetchQuery({
        queryKey: ['campaigns'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          const { data: brand } = await supabase
            .from('brands')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!brand) return [];

          const { data, error } = await supabase
            .from('opportunities')
            .select('*')
            .eq('brand_id', brand.id);

          if (error) throw error;
          return data;
        }
      });

      // Prefetch applications data
      await queryClient.prefetchQuery({
        queryKey: ['applications'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          const { data: brand } = await supabase
            .from('brands')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!brand) return [];

          const { data, error } = await supabase
            .from('applications')
            .select(`
              *,
              opportunity:opportunities!inner (*),
              creator:creators!inner (*)
            `)
            .eq('opportunities.brand_id', brand.id);

          if (error) throw error;
          return data;
        }
      });

      // Prefetch messages data
      await queryClient.prefetchQuery({
        queryKey: ['messages'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
            .limit(50);

          if (error) throw error;
          return data;
        }
      });

      console.log("Data prefetching completed");
    };

    prefetchData();
  }, [queryClient]);

  return (
    <div className="flex min-h-screen bg-nino-bg">
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isMobile && isMobileMenuOpen && (
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
            className="fixed inset-y-0 left-0 z-40 w-64"
          >
            <Sidebar />
          </motion.div>
        </>
      )}

      <div className="flex-1 overflow-x-hidden w-full">
        <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 py-6 px-4 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-nino-bg via-nino-bg/80 to-transparent" />
          <div className="relative">
            <DashboardHeader />
          </div>
        </div>
        
        <div className="p-4 pt-28 md:p-8 md:pt-32">
          <div key={location.pathname} className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandLayout;