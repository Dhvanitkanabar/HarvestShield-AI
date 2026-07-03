"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor, MapPin } from "lucide-react";

export default function DriverDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
      <p className="text-muted-foreground">Manage your logistics and transport requests.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assigned Trips</CardTitle>
            <Tractor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">All time deliveries</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
