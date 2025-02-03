import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminBrands from "@/components/admin/AdminBrands";
import AdminCreators from "@/components/admin/AdminCreators";
import AdminProjects from "@/components/admin/AdminProjects";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['check-admin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data;
    }
  });

  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/brands",
    element: (
      <AdminRoute>
        <AdminLayout>
          <AdminBrands />
        </AdminLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/creators",
    element: (
      <AdminRoute>
        <AdminLayout>
          <AdminCreators />
        </AdminLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/projects",
    element: (
      <AdminRoute>
        <AdminLayout>
          <AdminProjects />
        </AdminLayout>
      </AdminRoute>
    ),
  },
];