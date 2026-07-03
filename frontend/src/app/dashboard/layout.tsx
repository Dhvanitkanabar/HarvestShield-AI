"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sprout, LayoutDashboard, Tractor, Warehouse, TrendingUp, ShieldAlert, LogOut, Package, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!token || !userRole) {
      router.push("/login");
    } else {
      // eslint-disable-next-line
      setRole(userRole);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!role) return <div className="p-8">Loading...</div>;

  const links = [
    { name: "Overview", href: `/dashboard/${role.toLowerCase()}`, icon: LayoutDashboard },
  ];

  if (role === "FARMER") {
    links.push({ name: "My Harvests", href: "/dashboard/farmer/harvests", icon: Tractor });
    links.push({ name: "Recommendations", href: "/dashboard/farmer/ai", icon: TrendingUp });
  } else if (role === "WAREHOUSE_MANAGER" || role === "WAREHOUSE") {
    links.push({ name: "Inventory", href: "/dashboard/warehouse/inventory", icon: Package });
    links.push({ name: "Capacity", href: "/dashboard/warehouse/capacity", icon: Warehouse });
  } else if (role === "ADMIN") {
    links.push({ name: "Analytics", href: "/dashboard/admin/analytics", icon: TrendingUp });
    links.push({ name: "Audit Logs", href: "/dashboard/admin/audit", icon: ShieldAlert });
  }

  links.push({ name: "Maps", href: `/dashboard/${role.toLowerCase()}/maps`, icon: Map });

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b text-primary">
          <Sprout className="h-6 w-6" />
          <span className="font-bold text-lg">HarvestShield</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button variant="ghost" className="w-full justify-start">
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
