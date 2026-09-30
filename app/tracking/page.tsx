"use client";

import Link from "next/link";
import { MapPin, Phone, TimerReset, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getJobById, updateJob } from "@/lib/demo-store";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

export default function TrackingPage() {
  const [mounted, setMounted] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [fundi, setFundi] = useState<any>(null);
  const [jobLoadError, setJobLoadError] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "paid">("idle");

  useEffect(() => {
    setMounted(true);
    const activeJobId = window.localStorage.getItem("kejacare-active-job-id");
    setJobId(activeJobId ?? null);
    if (activeJobId) {
      setJob(getJobById(activeJobId));
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;
    let isActive = true;
    const supabase = createSupabaseClient();
    const channel = supabase
      .channel(`tracking-job-${jobId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs", filter: `id=eq.${jobId}` }, (payload) => {
        if (isActive && payload.new) setJob(payload.new);
      })
      .subscribe();

    const loadJob = async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", jobId).maybeSingle();
      if (!isActive) return;
      if (error) {
        console.error("Unable to load tracking job from Supabase", error);
        const demoJob = getJobById(jobId);
        setJob(demoJob);
        setJobLoadError(demoJob ? "Showing the local demo job because Supabase could not load it." : error.message);
      } else {
        setJob(data);
        setJobLoadError(data ? null : "This booking is not available in the Supabase jobs table.");
      }
    };

    void loadJob();
    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, [jobId]);

  useEffect(() => {
    if (!job?.fundi_id) {
      setFundi(null);
      return;
    }

    let isActive = true;
    const loadFundi = async () => {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from("fundis").select("*").eq("id", job.fundi_id).maybeSingle();
      if (isActive && !error) setFundi(data);
      if (error) console.error("Unable to load fundi details from Supabase", error);
    };

    void loadFundi();
    return () => {
      isActive = false;
    };
  }, [job?.fundi_id]);

  useEffect(() => {
    if (!job || ["cancelled", "completed"].includes(job.status)) return;

    const interval = setInterval(() => {
      setJob((current: any) => {
        if (!current) return current;

        let nextStatus = current.status;
        if (current.status === "accepted") nextStatus = "en_route";
        else if (current.status === "en_route") nextStatus = "arrived";
        else if (current.status === "arrived") nextStatus = "completed";

        if (nextStatus !== current.status) {
          updateJob(current.id, { status: nextStatus });
          void createSupabaseClient()
            .from("jobs")
            .update({ status: nextStatus })
            .eq("id", current.id)
            .then(({ error }) => {
              if (error) console.error("Unable to sync simulated job status to Supabase", error);
            });
          return { ...current, status: nextStatus };
        }

        return current;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [job?.id, job?.status]);

  const statusLabel = job?.status ?? "pending";
  const paymentReady = statusLabel === "completed";
  const serviceLabel = job?.service_type ?? job?.service ?? "Home service";
  const jobPrice = job?.price ?? job?.amount ?? 0;

  const handleMpesa = () => {
    if (!paymentReady) return;
    setPaymentState("processing");
    setTimeout(() => setPaymentState("paid"), 1200);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md animate-pulse rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-52 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-lg font-semibold text-slate-900">No active job yet</p>
          <p className="mt-2 text-sm text-slate-600">Book a fundi first to begin tracking.</p>
          {jobLoadError && <p className="mt-2 text-sm text-amber-700">{jobLoadError}</p>}
          <Link href="/client" className="mt-6 inline-block">
            <Button>Go to client dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0D9488]">Live tracking</p>
            <h1 className="text-xl font-bold text-slate-900">
              {statusLabel === "completed" ? "Job completed" : statusLabel === "arrived" ? "Fundi has arrived" : statusLabel === "en_route" ? "Fundi on the way" : "Awaiting acceptance"}
            </h1>
          </div>
          <Link href="/client">
            <Button variant="outline">Back to booking</Button>
          </Link>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="overflow-hidden">
            <div className="relative h-[420px] bg-[linear-gradient(135deg,#d9f7f3_0%,#eef9f8_40%,#f8fafc_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(13,148,136,0.18),transparent_18%),radial-gradient(circle_at_75%_70%,rgba(245,158,11,0.18),transparent_20%)]" />

              <div className="absolute left-[18%] top-[35%] h-4 w-4 rounded-full bg-[#0D9488] shadow-[0_0_0_10px_rgba(13,148,136,0.15)]" />
              <div className="absolute left-[62%] top-[48%] h-4 w-4 rounded-full bg-[#F59E0B] shadow-[0_0_0_10px_rgba(245,158,11,0.15)]" />
              <div className="absolute left-[22%] top-[39%] h-[2px] w-[40%] rotate-[12deg] bg-[#0D9488]" />

              <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-3 py-2 shadow-sm">
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-lg font-bold capitalize text-slate-900">{statusLabel.replace("_", " ")}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={fundi?.avatar_url ?? fundi?.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
                    alt={fundi?.name ?? fundi?.full_name ?? "Fundi"}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{fundi?.name ?? fundi?.full_name ?? "Demo Fundi"}</h3>
                        <p className="text-sm text-slate-500">{serviceLabel} • Rated {fundi?.rating ?? 4.9}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Distance</span>
                    <span className="font-semibold text-slate-900">1.2 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vehicle</span>
                    <span className="font-semibold text-slate-900">Boda / Van</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Arrival</span>
                    <span className="font-semibold text-slate-900">Today, 3:30 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <TimerReset className="h-4 w-4 text-[#0D9488]" />
                  ETA: {statusLabel === "completed" ? "Done" : "8 minutes"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-[#0D9488]" />
                  +254 712 345 678
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-[#0D9488]" />
                  1.2 km from your location
                </div>
                <Button variant="outline" className="w-full">
                  Chat with fundi
                </Button>

                {paymentReady ? (
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full" onClick={handleMpesa}>
                      {paymentState === "paid" ? "Paid successfully" : paymentState === "processing" ? "Processing..." : "Pay via M-Pesa"}
                    </Button>
                    {paymentState === "paid" && (
                      <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
                        M-Pesa payment received: KES {jobPrice}
                      </div>
                    )}
                  </div>
                ) : null}

                <Button variant="ghost" className="w-full text-red-600">
                  <XCircle className="mr-2 h-4 w-4" /> Cancel booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
