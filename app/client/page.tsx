"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentSession, setDemoRealtimeTick } from "@/lib/demo-store";
import { fundis as mockFundis, services, type FundiProfile } from "@/lib/mock-data";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

const clientLocation = { lat: -1.3745, lng: 37.9718 };

export default function ClientDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ userId: string; name: string; role: string; phone: string } | null>(null);
  const [availableOnlineFundis, setAvailableOnlineFundis] = useState<FundiProfile[]>(mockFundis.filter((fundi) => fundi.online));
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [selectedFundi, setSelectedFundi] = useState(mockFundis[0].id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [notes, setNotes] = useState("Please arrive by 3:30 PM and bring a ladder.");
  const [houseDescription, setHouseDescription] = useState("2-bedroom apartment in Kitui, leak near kitchen sink.");
  const [scheduledAt, setScheduledAt] = useState("2026-09-30T15:30");

  useEffect(() => {
    setMounted(true);
    const syncSession = () => setSession(getCurrentSession());
    syncSession();
    const unsubscribe = setDemoRealtimeTick(syncSession);

    const loadFundis = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.from("fundis").select("*").eq("is_online", true);
        if (error) throw error;

        const rows = (data ?? []).map((row, index) => {
          const record = row as Record<string, unknown>;
          const skillsValue = record.skills ?? record.services ?? record.service_categories ?? record.specialties ?? record.service_type ?? record.service;
          const skills = Array.isArray(skillsValue)
            ? skillsValue.map(String)
            : typeof skillsValue === "string"
              ? skillsValue.split(/[,•]/).map((skill) => skill.trim()).filter(Boolean)
              : [];
          const location = record.location as { lat?: number; lng?: number } | null;
          const id = String(record.id ?? `remote-fundi-${index}`);
          const name = String(record.name ?? record.full_name ?? "KejaCare fundi");

          return {
            id,
            name,
            rating: Number(record.rating ?? 4.8),
            price: Number(record.price_per_day ?? record.daily_rate ?? record.price ?? record.hourly_rate ?? record.rate ?? 0),
            distance: String(record.distance ?? record.location ?? "Nearby"),
            verified: Boolean(record.is_verified ?? record.verified ?? false),
            gender: record.gender === "Male" ? "Male" as const : "Female" as const,
            skills,
            location: {
              lat: Number(record.location_lat ?? location?.lat ?? -1.3733),
              lng: Number(record.location_lng ?? location?.lng ?? 37.9709),
            },
            avatar: String(record.avatar_url ?? record.profile_picture ?? record.image_url ?? record.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"),
            online: true,
          } satisfies FundiProfile;
        });

        if (rows.length > 0) {
          setAvailableOnlineFundis(rows);
          setSelectedFundi(rows[0].id);
        } else {
          setAvailableOnlineFundis([]);
        }
        setSupabaseError(null);
      } catch (error) {
        console.error("Unable to load online fundis from Supabase", error);
        setSupabaseError("Could not load fundis from Supabase; showing demo fundis.");
      }
    };

    void loadFundis();
    return unsubscribe;
  }, []);

  const availableFundis = useMemo(() => {
    const selected = services.find((service) => service.id === selectedService);
    const terms = selected ? [selected.id, selected.name, selected.short].map((value) => value.toLowerCase()) : [];
    return availableOnlineFundis.filter((fundi) => {
      if (terms.length === 0) return true;
      return fundi.skills.some((skill) => {
        const normalizedSkill = skill.toLowerCase();
        return terms.some((term) => normalizedSkill.includes(term) || term.includes(normalizedSkill));
      });
    });
  }, [availableOnlineFundis, selectedService]);

  const activeService = useMemo(
    () => services.find((service) => service.id === selectedService) ?? services[0],
    [selectedService],
  );

  useEffect(() => {
    if (!availableFundis.some((fundi) => fundi.id === selectedFundi)) {
      setSelectedFundi(availableFundis[0]?.id ?? availableOnlineFundis[0]?.id ?? mockFundis[0].id);
    }
  }, [availableFundis, availableOnlineFundis, selectedFundi]);

  const activeFundi = useMemo(
    () => availableFundis.find((fundi) => fundi.id === selectedFundi) ?? availableFundis[0] ?? availableOnlineFundis[0] ?? mockFundis[0],
    [availableFundis, availableOnlineFundis, selectedFundi],
  );

  const handleBook = async () => {
    setBooking(true);
    try {
      const supabase = createSupabaseClient();
      let clientId: string | null = null;
      if (session?.phone) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("phone", session.phone)
          .maybeSingle();
        clientId = profile?.id ?? null;
        if (!clientId) {
          const { data: createdProfile, error: profileError } = await supabase
            .from("profiles")
            .insert({ role: "client", name: session.name, phone: session.phone })
            .select("id")
            .single();
          if (profileError) console.warn("Could not create client profile for booking", profileError);
          clientId = createdProfile?.id ?? null;
        }
      }

      const { data: job, error } = await supabase
        .from("jobs")
        .insert({
          client_id: clientId,
          fundi_id: activeFundi.id,
          service: activeService.name,
          status: "pending",
          amount: activeFundi.price,
        })
        .select("id")
        .single();

      if (error) throw error;
      window.localStorage.setItem("kejacare-active-job-id", String(job.id));
      window.localStorage.setItem("kejacare-active-fundi-id", activeFundi.id);
      router.push("/tracking");
    } catch (error) {
      console.error("Unable to create job in Supabase", error);
      alert(error instanceof Error ? `Booking failed: ${error.message}` : "Booking failed. Check the Supabase table policies and try again.");
    } finally {
      setBooking(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-20 rounded-2xl bg-slate-200" />
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-72 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0D9488]">KejaCare</p>
            <h1 className="text-xl font-bold text-slate-900">Client dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm text-slate-500">
              <p className="font-medium text-slate-900">Kitui Town</p>
              <p>Karibu, {session?.name ?? "Mkenya"}</p>
            </div>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4" />
              Call support
            </Button>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Choose service</h2>
            <Link href="/auth" className="text-sm font-medium text-[#0D9488]">
              Switch role
            </Link>
          </div>
          {supabaseError && <p className="text-sm text-amber-700">{supabaseError}</p>}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedService === service.id
                    ? "border-[#0D9488] bg-[#0D9488]/5 shadow-sm"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-3 text-2xl">{service.icon}</div>
                <div className="text-sm font-semibold text-slate-900">{service.name}</div>
                <div className="text-xs text-slate-500">{service.short}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="bg-[radial-gradient(circle_at_center,_#d7f4f1,_#effaf8_50%,_#f8fafc_100%)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Nearby fundis</p>
                    <h3 className="text-lg font-semibold text-slate-900">Map view</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0D9488]">
                    {activeService.name}
                  </span>
                </div>

                <div className="relative h-72 overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#d8f2ef_0%,#f1faf9_40%,#f8fafc_100%)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(13,148,136,0.15),transparent_20%),radial-gradient(circle_at_80%_60%,rgba(245,158,11,0.18),transparent_25%)]" />
                  {availableFundis.map((fundi, index) => (
                    <button
                      key={fundi.id}
                      type="button"
                      onClick={() => setSelectedFundi(fundi.id)}
                      className="absolute"
                      style={{
                        left: `${18 + (index % 4) * 18}%`,
                        top: `${25 + (index % 3) * 22}%`,
                      }}
                    >
                      <div className="rounded-full border-2 border-white bg-[#0D9488] px-2 py-1 text-xs font-semibold text-white shadow-lg">
                        KES {fundi.price}
                      </div>
                    </button>
                  ))}
                  <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
                    <MapPin className="mr-1 inline h-3.5 w-3.5 text-[#0D9488]" />
                    Kitui, Kenya
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Book a {activeService.name}</h3>
                  <span className="text-sm text-slate-500">Now or later</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Preferred date
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Budget
                    <input
                      defaultValue={`KES ${activeFundi.price}`}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  House description
                  <textarea
                    value={houseDescription}
                    onChange={(e) => setHouseDescription(e.target.value)}
                    className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Special notes
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                  />
                </label>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={activeFundi.avatar} alt={activeFundi.name} className="h-14 w-14 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-slate-900">{activeFundi.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="h-4 w-4 fill-current" /> {activeFundi.rating}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      activeFundi.online ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {activeFundi.online ? "Online now" : "Offline"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Rate</span>
                    <span className="font-semibold text-slate-900">KES {activeFundi.price}/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Distance</span>
                    <span className="font-semibold text-slate-900">{activeFundi.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verification</span>
                    <span className="inline-flex items-center gap-1 text-[#0D9488]">
                      <ShieldCheck className="h-4 w-4" />
                      {activeFundi.verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={() => setBookingOpen(true)}>
                    Book now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Available fundis</h3>
                <div className="space-y-3">
                  {availableFundis.map((fundi) => (
                    <button
                      key={fundi.id}
                      type="button"
                      onClick={() => setSelectedFundi(fundi.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                        selectedFundi === fundi.id
                          ? "border-[#0D9488] bg-[#0D9488]/5"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={fundi.avatar} alt={fundi.name} className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-slate-900">{fundi.name}</p>
                          <p className="text-xs text-slate-500">{fundi.gender} • {fundi.distance}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">KES {fundi.price}</p>
                        <p className="text-xs text-amber-500">★ {fundi.rating}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Book {activeFundi.name}</h3>
              <button type="button" onClick={() => setBookingOpen(false)} className="text-sm text-slate-500">
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Service</span>
                  <span className="font-semibold text-slate-900">{activeService.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Price</span>
                  <span className="font-semibold text-slate-900">KES {activeFundi.price}</span>
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                House address
                <input
                  defaultValue="Kitui Town, Plot 45, Main Road"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Notes
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                />
              </label>

              <Button className="w-full" onClick={handleBook} disabled={booking || availableOnlineFundis.length === 0}>
                {booking ? "Creating booking..." : availableOnlineFundis.length === 0 ? "No online fundis available" : "Confirm booking"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
