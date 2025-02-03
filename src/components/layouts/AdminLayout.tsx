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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="px-4 py-6">
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
              </div>
              <nav className="space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        location.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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