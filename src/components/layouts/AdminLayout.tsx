import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Grid, Users, FileText, Building2 } from "lucide-react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Grid },
    { name: 'Brands', href: '/admin/brands', icon: Building2 },
    { name: 'Creators', href: '/admin/creators', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-nino-bg">
      <div className="flex">
        {/* Floating Sidebar */}
        <div className="fixed left-6 top-6 bottom-6 w-64 bg-nino-white rounded-2xl shadow-lg border border-[#E5E5E5] overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="px-6 py-8 border-b border-[#E5E5E5]">
                <h2 className="text-2xl font-semibold text-nino-primary">Nino Admin</h2>
                <p className="text-sm text-nino-gray mt-1">Management Dashboard</p>
              </div>
              <nav className="space-y-1 px-3 py-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-nino-primary text-nino-white shadow-sm"
                          : "text-nino-text hover:bg-nino-bg hover:text-nino-primary"
                      )}
                    >
                      <Icon className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-nino-white" : "text-nino-gray group-hover:text-nino-primary"
                      )} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-[21rem]">
          <main className="py-8 px-8 max-w-6xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;