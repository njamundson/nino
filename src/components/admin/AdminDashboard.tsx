import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Building2, UserCheck, FileSpreadsheet, ClipboardCheck, UserCog, AlertCircle } from "lucide-react";

type AdminAnalytics = {
  total_users: number;
  total_brands: number;
  total_creators: number;
  total_opportunities: number;
  total_applications: number;
  pending_applications: number;
  pending_verifications: number;
};

export const AdminDashboard = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_analytics');
      if (error) throw error;
      return data as AdminAnalytics;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        <p>Error loading analytics data. Please try again later.</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics?.total_users || 0,
      icon: Users,
      description: "Registered users on the platform",
    },
    {
      title: "Total Brands",
      value: analytics?.total_brands || 0,
      icon: Building2,
      description: "Active brands",
    },
    {
      title: "Total Creators",
      value: analytics?.total_creators || 0,
      icon: UserCheck,
      description: "Registered creators",
    },
    {
      title: "Total Opportunities",
      value: analytics?.total_opportunities || 0,
      icon: FileSpreadsheet,
      description: "Posted opportunities",
    },
    {
      title: "Total Applications",
      value: analytics?.total_applications || 0,
      icon: ClipboardCheck,
      description: "Submitted applications",
    },
    {
      title: "Pending Applications",
      value: analytics?.pending_applications || 0,
      icon: AlertCircle,
      description: "Applications awaiting review",
    },
    {
      title: "Pending Verifications",
      value: analytics?.pending_verifications || 0,
      icon: UserCog,
      description: "Creators awaiting verification",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};