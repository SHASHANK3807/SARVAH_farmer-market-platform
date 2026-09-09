"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "farmer";
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("Latur");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password, role, district }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success(locale === "mr" ? "यशस्वीरित्या नोंदणी झाली" : "Registered successfully");
      await mutate("/api/auth/me");
      
      if (role === "farmer") {
        router.push(`/${locale}/farmer?crop=soybean&district=${district.toLowerCase()}`);
      } else {
        router.push(`/${locale}/buyer/lots`);
      }
      router.refresh();
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
            {locale === "mr" ? "नवीन खाते नोंदणी" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {locale === "mr" 
              ? `सर्वह वर ${role === "farmer" ? "शेतकरी" : "खरेदीदार"} म्हणून नोंदणी करा` 
              : `Join Sarvah as a ${role === "farmer" ? "Farmer" : "Buyer"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{locale === "mr" ? "पूर्ण नाव" : "Full Name"}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "farmer" ? "Priya Patil" : "Rajan Traders"} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{locale === "mr" ? "मोबाईल क्रमांक" : "Phone Number"}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">{locale === "mr" ? "जिल्हा" : "District"}</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latur">{locale === "mr" ? "लातूर (Latur)" : "Latur"}</SelectItem>
                  <SelectItem value="Pune">{locale === "mr" ? "पुणे (Pune)" : "Pune"}</SelectItem>
                  <SelectItem value="Nashik">{locale === "mr" ? "नाशिक (Nashik)" : "Nashik"}</SelectItem>
                  <SelectItem value="Solapur">{locale === "mr" ? "सोलापूर (Solapur)" : "Solapur"}</SelectItem>
                  <SelectItem value="Nagpur">{locale === "mr" ? "नागपूर (Nagpur)" : "Nagpur"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{locale === "mr" ? "पासवर्ड" : "Password"}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-base">
              {loading ? (locale === "mr" ? "नोंदणी करत आहे..." : "Creating account...") : (locale === "mr" ? "नोंदणी करा" : "Register")}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              {locale === "mr" ? "आधीच खाते आहे?" : "Already have an account?"}{" "}
              <Link href={`/${locale}/login?role=${role}`} className="text-emerald-600 hover:underline font-semibold">
                {locale === "mr" ? "लॉगिन करा" : "Login here"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
