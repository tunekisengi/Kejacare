"use client";

import { MapPinned, MessageSquareText, Phone, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCurrentSession,
  getIncomingJobsForFundi,
  getProfileById,
  setDemoRealtimeTick,
  updateJob,
  updateProfile,
} from "@/lib/demo-store";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

export default function FundiDashboard() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ userId: string; name: string; role: string; phone: string } | null>(null);
  const [online, setOnline] = useState(true);
  const [jobRequests, setJobRequests] = useState<any[]>([]);
  const [status, setStatus] = useState("accepted");
  const [supabaseFundiId, setSupabaseFundiId] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const fundiId = session?.userId ?? "fundi_1";

  useEffect(() => {
    setMounted(true);
    const syncSession = () => {
      const current = getCurrentSession();
      setSession(current ? { ...current, phone: current.phone } : null);
      const profile = current ? getProfileById(current.userId) : null;
      setOnline(Boolean(profile?.is_online ?? true));
      setJobRequests(getIncomingJobsForFundi(current?.userId ?? fundiId));
      const storedJobId = window.localStorage.getItem("kejacare-active-job-id");
      setActiveJobId(storedJobId);
      setStatus(window.localStorage.getItem("kejacare_job_status") ?? "accepted");
    };

    syncSession();
    const unsubscribe = setDemoRealtimeTick(syncSession);
    return unsubscribe;
  }, [fundiId]);

  useEffect(() => {
    if (!mounted || !session) return;

    const supabase = createSupabaseClient();
    let resolvedFundiId: string | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let isActive = true;

    const loadJobs = async () => {
      if (!resolvedFundiId) return;
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("fundi_id", resolvedFundiId)
        .in("status", ["pending", "accepted", "en_route", "arrived", "in_progress"])
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Unable to load Supabase job requests", error);
        return;
      }

      if (isActive) setJobRequests(data ?? []);
    };

    const resolveFundi = async () => {
      const storedId = window.localStorage.getItem("kejacare-active-fundi-id");
      let profile: { id: string; is_online: boolean | null } | null = null;
      if (!storedId) {
        const { data, error } = await supabase
          .from("fundis")
          .select("id,is_online")
          .eq("name", session.name)
          .maybeSingle();
        if (error) console.error("Unable to load Supabase fundi profile", error);
        profile = data;
        if (!profile) {
          const { data: firstOnlineFundi, error: fallbackError } = await supabase
            .from("fundis")
            .select("id,is_online")
            .eq("is_online", true)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();
          if (fallbackError) console.error("Unable to resolve an online Supabase fundi", fallbackError);
          profile = firstOnlineFundi;
        }
      }

      resolvedFundiId = storedId ?? (profile?.id ? String(profile.id) : null);
      if (!isActive) return;
      setSupabaseFundiId(resolvedFundiId);
      if (typeof profile?.is_online === "boolean") setOnline(profile.is_online);
      await loadJobs();

      if (resolvedFundiId) {
        channel = supabase
          .channel(`fundi-jobs-${resolvedFundiId}`)
          .on("postgres_changes", { event: "*", schema: "public", table: "jobs", filter: `fundi_id=eq.${resolvedFundiId}` }, () => {
            void loadJobs();
          })
          .subscribe();
      }
    };

    void resolveFundi();
    return () => {
      isActive = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [mounted, session?.name, session?.phone, session?.userId]);

  const handleOnlineToggle = () => {
    const next = !online;
    if (session) updateProfile(session.userId, { is_online: next });
    setOnline(next);
    if (supabaseFundiId) {
      void createSupabaseClient()
        .from("fundis")
        .update({ is_online: next })
        .eq("id", supabaseFundiId)
        .then(({ error }) => {
          if (error) console.error("Unable to update Supabase online status", error);
        });
    }
  };

  const handleAcceptJob = (jobId: string) => {
    updateJob(jobId, { status: "accepted" });
    window.localStorage.setItem("kejacare-active-job-id", jobId);
    setActiveJobId(jobId);
    setStatus("accepted");
    void createSupabaseClient()
      .from("jobs")
      .update({ status: "accepted" })
      .eq("id", jobId)
      .then(({ error }) => {
        if (error) alert(`Could not accept job in Supabase: ${error.message}`);
      });
  };

  const handleDeclineJob = (jobId: string) => {
    updateJob(jobId, { status: "cancelled" });
    void createSupabaseClient()
      .from("jobs")
      .update({ status: "cancelled" })
      .eq("id", jobId)
      .then(({ error }) => {
        if (error) alert(`Could not decline job in Supabase: ${error.message}`);
      });
  };

  const updateActiveJobStatus = async (nextStatus: "en_route" | "arrived" | "completed") => {
    setStatus(nextStatus);
    window.localStorage.setItem("kejacare_job_status", nextStatus);
    if (!activeJobId) {
      alert("No active job selected yet. Accept a job request first.");
      return;
    }

    updateJob(activeJobId, { status: nextStatus });
    const { error } = await createSupabaseClient()
      .from("jobs")
      .update({ status: nextStatus })
      .eq("id", activeJobId);
    if (error) {
      alert(`Status saved in demo mode, but Supabase update failed: ${error.message}`);
      return;
    }

    if (nextStatus === "arrived") alert("You have arrived - client notified");
    if (nextStatus === "completed") window.location.href = "/tracking?status=completed";
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-20 rounded-2xl bg-slate-200" />
          <div className="h-52 rounded-2xl bg-slate-200" />
          <div className="h-56 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0D9488]">Fundi dashboard</p>
            <h1 className="text-xl font-bold text-slate-900">{session?.name ?? "Demo Fundi"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${
                online ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
              }`}
            >
              <Power className="h-4 w-4" />
              {online ? "Online" : "Offline"}
            </div>
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleOnlineToggle}>
              Toggle status
            </Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile setup</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" defaultValue={session?.name ?? "Demo Fundi"} />
                <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="ID 23456789" />
                <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 md:col-span-2" defaultValue="Mama Fua • Cleaning • Laundry" />
                <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="KES 800/day" />
                <input className="rounded-xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="Kitui town" />
                <textarea className="min-h-28 rounded-xl border border-slate-200 bg-white px-3 py-2.5 md:col-span-2" defaultValue="I provide reliable home cleaning and laundry services with good conduct and friendly service." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incoming job requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobRequests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                    No pending jobs right now. Your inbox is clear.
                  </div>
                ) : (
                  jobRequests.map((job) => (
                    <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{job.client_id}</p>
                          <p className="text-sm text-slate-500">{job.service_type ?? job.service ?? "Home service"}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#0D9488]">KES {job.price ?? job.amount ?? 0}</span>
                      </div>
                      <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
                        <MapPinned className="h-4 w-4 text-[#0D9488]" />
                        Kitui town, Kenya
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 cursor-pointer" onClick={() => handleAcceptJob(job.id)}>
                          Accept
                        </Button>
                        <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => handleDeclineJob(job.id)}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-[#0D9488]/5 p-4">
                  <p className="text-sm text-slate-500">Client</p>
                  <p className="text-lg font-semibold text-slate-900">Demo Client</p>
                  <p className="text-sm text-slate-600">House cleaning • 15:30 today</p>
                  <p className="mt-2 text-sm font-medium capitalize text-[#0D9488]">Job status: {status}</p>
                </div>

                <div className="grid gap-2">
                  <Button className="w-full cursor-pointer" onClick={() => window.open("https://maps.google.com/?q=Kitui+town", "_blank")}>
                    Navigate to client
                  </Button>
                  <Button variant="outline" className="w-full cursor-pointer" onClick={() => alert("Chat feature coming - this is demo")}>
                    <MessageSquareText className="mr-2 h-4 w-4" /> Chat
                  </Button>
                  <Button variant="outline" className="w-full cursor-pointer" onClick={() => alert("Chat feature coming - this is demo")}>
                    <Phone className="mr-2 h-4 w-4" /> Call client
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full cursor-pointer" onClick={() => void updateActiveJobStatus("en_route")}>
                    En route
                  </Button>
                  <Button variant="secondary" className="w-full cursor-pointer" onClick={() => void updateActiveJobStatus("arrived")}>
                    Mark arrived
                  </Button>
                  <Button className="col-span-2 w-full cursor-pointer" onClick={() => void updateActiveJobStatus("completed")}>
                    Completed
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-emerald-50 p-3">
                    <p className="text-emerald-700">Earnings</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">KES 8,400</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3">
                    <p className="text-amber-700">Jobs done</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">17</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full cursor-pointer"
                  onClick={() => alert("Withdrawal request sent - KES 8,400 to your M-Pesa")}
                >
                  M-Pesa withdrawal
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
