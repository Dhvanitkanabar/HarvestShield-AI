"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiClient } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Sprout } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState("FARMER");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    
    try {
      await apiClient.post("/auth/register", { email, password, fullName, role });
      toast.success("Registered successfully! Please login.");
      router.push("/login");
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.response?.data?.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-8 text-primary">
        <Sprout className="h-10 w-10" />
        <span className="text-3xl font-bold tracking-tight">HarvestShield AI</span>
      </div>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join the agricultural supply chain platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(val) => val && setRole(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FARMER">Farmer</SelectItem>
                  <SelectItem value="WAREHOUSE_MANAGER">Warehouse Manager</SelectItem>
                  <SelectItem value="MARKET">Market</SelectItem>
                  <SelectItem value="PROCESSOR">Food Processor</SelectItem>
                  <SelectItem value="FPO">FPO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-sm text-center">
          <div className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
