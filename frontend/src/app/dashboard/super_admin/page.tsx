"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Server } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
      <p className="text-muted-foreground">System-wide monitoring and root access control.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">Online</div>
            <p className="text-xs text-muted-foreground">All services operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Shield className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Maximum</div>
            <p className="text-xs text-muted-foreground">No breaches detected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
