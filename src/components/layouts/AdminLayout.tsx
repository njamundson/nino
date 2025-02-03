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
        {/* Sidebar */}
        <div className="w-64 bg-nino-white border-r border-nino-gray/10 min-h-screen">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="px-4 py-6 border-b border-nino-gray/10">
                <h2 className="text-2xl font-bold text-nino-primary">Nino Admin</h2>
                <p className="text-sm text-nino-gray mt-1">Management Dashboard</p>
              </div>
              <nav className="space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        location.pathname === item.href
                          ? "bg-nino-primary text-nino-white"
                          : "text-nino-text hover:bg-nino-bg hover:text-nino-primary"
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="py-6 px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;