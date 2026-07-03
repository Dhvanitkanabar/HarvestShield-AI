"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tractor, Sprout, AlertTriangle, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", yield: 4000 },
  { name: "Feb", yield: 3000 },
  { name: "Mar", yield: 2000 },
  { name: "Apr", yield: 2780 },
  { name: "May", yield: 1890 },
  { name: "Jun", yield: 2390 },
];

export default function FarmerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
      <p className="text-muted-foreground">Manage your harvests, view AI recommendations, and monitor market prices.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Harvests</CardTitle>
            <Tractor className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Sprout className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Wheat, Rice, Corn, Soybeans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Spoilage Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1 Risk</div>
            <p className="text-xs text-muted-foreground">Batch #B-004 has high moisture</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Bullish</div>
            <p className="text-xs text-muted-foreground">Prices up 14% for Wheat</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Harvest Yield (kg)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="yield" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>AI Intelligence</CardTitle>
            <CardDescription>Latest insights from the AI Engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 border p-3 rounded-md bg-zinc-100 dark:bg-zinc-800/50">
              <Badge variant="destructive">SELL NOW</Badge>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">High Demand Detected</p>
                <p className="text-xs text-muted-foreground">Market demand for Wheat is 85%. Prices are peaking.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border p-3 rounded-md bg-zinc-100 dark:bg-zinc-800/50">
              <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">STORE</Badge>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Prices Expected to Rise</p>
                <p className="text-xs text-muted-foreground">Corn prices will increase by 5% next week.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
