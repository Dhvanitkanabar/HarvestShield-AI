"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiClient } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Sprout } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      // Temporary mock login for development purposes
      if (email === "admin@harvestshield.com" && password === "admin") {
         localStorage.setItem("token", "mock-jwt-token");
         localStorage.setItem("userRole", "ADMIN");
         toast.success("Logged in successfully!");
         router.push("/dashboard/admin");
      } else {
         const response = await apiClient.post("/auth/login", { email, password });
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("userRole", response.data.user.role);
         toast.success("Logged in successfully!");
         router.push(`/dashboard/${response.data.user.role.toLowerCase()}`);
      }
    } catch (error: unknown) {
      const err = error as any;
      toast.error(err.response?.data?.message || "Failed to login. Please check your credentials.");
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
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@harvestshield.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-sm text-center">
          <div className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <Link href="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
