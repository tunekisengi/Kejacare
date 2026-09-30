"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ensureProfileForAuth, setCurrentSession, updateProfile } from "@/lib/demo-store";

export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState<'client' | 'fundi' | 'admin'>('client');
  const [phone, setPhone] = useState("+254712345678");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("123456");

  useEffect(() => {
    console.log(role);
  }, [role]);

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleLogin = () => {
    if (otp !== "123456") {
      alert("Demo OTP is 123456");
      return;
    }

    const name = role === "client" ? "Demo Client" : role === "fundi" ? "Demo Fundi" : "KejaCare Admin";
    window.localStorage.setItem("kejacare_role", role);
    const profile = ensureProfileForAuth({ phone, role, name });
    updateProfile(profile.id, { role, name });
    setCurrentSession({ userId: profile.id, role, phone, name });

    if (role === "fundi") router.push("/fundi");
    else if (role === "admin") router.push("/admin");
    else router.push("/client");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#d9f5f3,_#f7faf9_40%,_#ffffff_100%)] px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            KejaCare
          </Link>
          <Link href="/" className="text-sm font-medium text-[#0D9488]">
            Back home
          </Link>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-3 pb-2">
            <span className="inline-flex w-fit rounded-full bg-[#0D9488]/10 px-3 py-1 text-xs font-semibold text-[#0D9488]">
              Karibu
            </span>
            <CardTitle className="text-2xl">Sign in to KejaCare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`rounded-xl px-3 py-2 text-sm font-medium capitalize ${
                  role === 'client' ? "bg-white text-[#0D9488] shadow-sm" : "text-slate-600"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole('fundi')}
                className={`rounded-xl px-3 py-2 text-sm font-medium capitalize ${
                  role === 'fundi' ? "bg-white text-[#0D9488] shadow-sm" : "text-slate-600"
                }`}
              >
                Fundi
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`rounded-xl px-3 py-2 text-sm font-medium capitalize ${
                  role === 'admin' ? "bg-white text-[#0D9488] shadow-sm" : "text-slate-600"
                }`}
              >
                Admin
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0"
                placeholder="+254712345678"
              />
            </div>

            {!otpSent ? (
              <Button className="w-full" onClick={handleSendOtp}>
                Send OTP
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Verification code</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0"
                    placeholder="123456"
                  />
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                  Demo code: <span className="font-semibold">123456</span>
                </div>
                <Button className="w-full" onClick={handleLogin}>
                  Continue
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
