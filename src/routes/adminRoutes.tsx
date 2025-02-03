import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminBrands from "@/components/admin/AdminBrands";
import AdminCreators from "@/components/admin/AdminCreators";
import AdminProjects from "@/components/admin/AdminProjects";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/brands",
    element: (
      <AdminLayout>
        <AdminBrands />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/creators",
    element: (
      <AdminLayout>
        <AdminCreators />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/projects",
    element: (
      <AdminLayout>
        <AdminProjects />
      </AdminLayout>
    ),
  },
];