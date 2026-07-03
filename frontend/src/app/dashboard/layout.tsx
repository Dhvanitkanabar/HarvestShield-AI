"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  LayoutDashboard,
  Tractor,
  Warehouse,
  TrendingUp,
  ShieldAlert,
  LogOut,
  Package,
  Map,
  BarChart2,
  Cpu,
  Activity,
  Sliders,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { I18nProvider, LanguageSwitcher, useTranslation } from "@/hooks/useTranslation";

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

function SidebarContent({ role }: { role: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    toast.success(t("common.save", "Logged out successfully"));
    router.push("/login");
  };

  const links: NavLink[] = [
    { name: t("nav.overview"), href: `/dashboard/${role.toLowerCase()}`, icon: LayoutDashboard },
  ];

  if (role === "FARMER") {
    links.push({ name: t("nav.harvests"), href: "/dashboard/farmer/harvests", icon: Tractor });
    links.push({ name: t("nav.recommendations"), href: "/dashboard/farmer/ai", icon: TrendingUp });
  } else if (role === "WAREHOUSE_MANAGER" || role === "WAREHOUSE") {
    links.push({ name: "Inventory", href: "/dashboard/warehouse/inventory", icon: Package });
    links.push({ name: "Capacity", href: "/dashboard/warehouse/capacity", icon: Warehouse });
  } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
    links.push({ name: t("nav.analytics"), href: `/dashboard/${role.toLowerCase()}/analytics`, icon: TrendingUp });
    links.push({ name: t("nav.impact"), href: `/dashboard/${role.toLowerCase()}/impact`, icon: BarChart2 });
    links.push({ name: t("nav.simulator"), href: `/dashboard/${role.toLowerCase()}/simulator`, icon: Sliders });
    links.push({ name: t("nav.iot"), href: `/dashboard/${role.toLowerCase()}/iot`, icon: Activity });
    links.push({ name: t("nav.audit"), href: `/dashboard/${role.toLowerCase()}/audit`, icon: ShieldAlert });
    links.push({ name: "AI Demo", href: `/dashboard/${role.toLowerCase()}/demo`, icon: Cpu });
  } else if (role === "DRIVER") {
    links.push({ name: "Logistics", href: "/dashboard/driver/logistics", icon: Tractor });
  } else if (role === "INSPECTOR") {
    links.push({ name: "Audits", href: "/dashboard/inspector/audits", icon: ShieldAlert });
  } else if (role === "ANALYST") {
    links.push({ name: "Data Insights", href: "/dashboard/analyst/insights", icon: BarChart2 });
  } else if (role === "MARKET") {
    links.push({ name: "Market Demand", href: "/dashboard/market/demand", icon: TrendingUp });
  }

  links.push({ name: t("nav.maps"), href: `/dashboard/${role.toLowerCase()}/maps`, icon: Map });

  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b">
        <div className="flex items-center gap-2 text-emerald-600">
          <Sprout className="h-6 w-6" aria-hidden="true" />
          <span className="font-bold text-base">HarvestShield</span>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" role="navigation" aria-label="Main navigation">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== `/dashboard/${role.toLowerCase()}` && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <link.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400"}`} aria-hidden="true" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Language switcher + Logout */}
      <div className="p-4 border-t space-y-3">
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          aria-label="Logout from HarvestShield"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {t("nav.logout")}
        </button>
      </div>
    </>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!token || !userRole) {
      router.push("/login");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(userRole);
    }

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failure is non-critical
      });
    }
  }, [router]);

  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Sprout className="h-8 w-8 text-emerald-500 animate-pulse" />
          <p className="text-sm text-slate-500">Loading HarvestShield AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:text-emerald-700 focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 h-full w-64 bg-white border-r flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Sidebar navigation"
      >
        <SidebarContent role={role} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b bg-white">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <Sprout className="h-5 w-5" />
            HarvestShield
          </div>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-6 md:p-8" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </I18nProvider>
  );
}
