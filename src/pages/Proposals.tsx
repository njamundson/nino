import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import PageHeader from "@/components/shared/PageHeader";

const Proposals = () => {
  const { toast } = useToast();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creator) throw new Error("Creator profile not found");

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            description,
            location,
            start_date,
            brand:brands (
              company_name,
              brand_type
            )
          )
        `)
        .eq('creator_id', creator.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    retry: 1,
    meta: {
      errorMessage: "Failed to load applications"
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Proposals" 
        description="Track your submitted proposals and their status" 
      />
      
      {isLoading ? (
        <div>Loading...</div>
      ) : applications && applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div 
              key={application.id}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-medium">
                {application.opportunity?.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {application.opportunity?.brand?.company_name}
              </p>
              <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No proposals submitted yet</p>
        </div>
      )}
    </div>
  );
};

export default Proposals;