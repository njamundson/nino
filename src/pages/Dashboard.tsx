import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nino-bg flex items-center justify-center">
        <div className="text-nino-primary">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-nino-bg p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-medium text-nino-text">
            Welcome, {profile?.first_name || 'Creator'}!
          </h1>
          <p className="text-nino-gray mt-2">
            Your creator dashboard is ready.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-nino-text mb-2">Profile</h2>
            <p className="text-nino-gray">
              Complete your profile to start collaborating with brands
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-nino-text mb-2">Opportunities</h2>
            <p className="text-nino-gray">
              Browse available collaboration opportunities
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-nino-text mb-2">Messages</h2>
            <p className="text-nino-gray">
              Connect with brands and manage your conversations
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;