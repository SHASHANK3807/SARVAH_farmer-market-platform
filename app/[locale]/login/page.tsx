"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "farmer";
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success(locale === "mr" ? "यशस्वीरित्या लॉग इन झाले" : "Logged in successfully");
      await mutate("/api/auth/me");
      
      if (data.user.role === "farmer") {
        router.push(`/${locale}/farmer?crop=soybean&district=latur`);
      } else {
        router.push(`/${locale}/buyer/lots`);
      }
      router.refresh(); // Tell Next.js to re-fetch Server Components
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-lg border-emerald-100">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-emerald-950">
            {locale === "mr" ? "लॉगिन" : "Login"}
          </CardTitle>
          <CardDescription>
            {locale === "mr" 
              ? `सर्वह मध्ये ${role === "farmer" ? "शेतकरी" : "खरेदीदार"} म्हणून स्वागत आहे` 
              : `Welcome back to Sarvah as a ${role === "farmer" ? "Farmer" : "Buyer"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{locale === "mr" ? "मोबाईल क्रमांक" : "Phone Number"}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{locale === "mr" ? "पासवर्ड" : "Password"}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-base">
              {loading ? (locale === "mr" ? "लॉगिन करत आहे..." : "Logging in...") : (locale === "mr" ? "लॉगिन करा" : "Login")}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              {locale === "mr" ? "खाते नाही?" : "Don't have an account?"}{" "}
              <Link href={`/${locale}/register?role=${role}`} className="text-emerald-600 hover:underline font-semibold">
                {locale === "mr" ? "नोंदणी करा" : "Register here"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
