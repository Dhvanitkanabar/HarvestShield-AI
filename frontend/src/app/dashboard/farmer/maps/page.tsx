"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";

// Dynamically import MapComponent to prevent SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/maps/MapComponent"), { ssr: false });

const mapLocations = [
  { lat: 21.1458, lng: 79.0882, label: "Warehouse A (Nagpur)" },
  { lat: 18.5204, lng: 73.8567, label: "Market (Pune)" },
  { lat: 19.0760, lng: 72.8777, label: "Processor (Mumbai)" },
];

export default function MapsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Geospatial Intelligence</h1>
      </div>
      <p className="text-muted-foreground">Locate nearby warehouses, markets, and processors.</p>

      <Card>
        <CardHeader>
          <CardTitle>Regional Infrastructure</CardTitle>
          <CardDescription>Interactive map of the agricultural supply chain.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 min-h-[400px]">
            <MapComponent locations={mapLocations} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
