import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, ShieldCheck, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { name: "Mama Fua", icon: "🧼", description: "Deep cleaning and laundry" },
  { name: "Plumber", icon: "🔧", description: "Leaking pipes and repairs" },
  { name: "Electrician", icon: "💡", description: "Wiring and installations" },
  { name: "Gas Tech", icon: "🔥", description: "Gas cylinder fixes" },
  { name: "Mover", icon: "📦", description: "Fast, careful relocation" },
  { name: "Fundi", icon: "🛠️", description: "General repair work" },
];

const steps = [
  { title: "Tell us your need", description: "Pick your service, location and time." },
  { title: "Choose a verified fundi", description: "Compare prices and ratings before you book." },
  { title: "Track and pay", description: "Watch live updates, chat, and pay via M-Pesa." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0D9488] text-lg font-bold text-white">
            K
          </div>
          <div>
            <p className="text-xl font-bold">KejaCare</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="#services">Services</Link>
          <Link href="#how-it-works">How it works</Link>
          <Link href="#why-us">Why KejaCare</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/auth">
            <Button>Book now</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[#0D9488]/10 px-3 py-1 text-sm font-medium text-[#0D9488]">
            Karibu to KejaCare
          </span>
          <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Fundi mlangoni in <span className="text-[#0D9488]">20 minutes</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Trusted home services in Kenya. Book a verified cleaner, plumber, electrician, mover, or repair fundi and track their arrival in real time.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth">
              <Button size="lg">Book Now</Button>
            </Link>
            <Link href="/client">
              <Button size="lg" variant="secondary">Explore providers</Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0D9488]" /> Verified fundis</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0D9488]" /> M-Pesa payments</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#0D9488]" /> Live tracking</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-[#F59E0B]/20 blur-2xl" />
          <div className="absolute -right-3 bottom-8 h-24 w-24 rounded-full bg-[#0D9488]/20 blur-2xl" />
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0D9488] to-[#0b7a70] p-5 text-white shadow-xl">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Live request</p>
                  <h2 className="mt-1 text-2xl font-bold">Plumber needed</h2>
                </div>
                <div className="rounded-full bg-[#F59E0B] px-2.5 py-1 text-xs font-semibold text-white">ETA 18 min</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-3">
                  <MapPin className="mb-2 h-5 w-5 text-[#F59E0B]" />
                  <p className="text-xs text-white/70">Location</p>
                  <p className="mt-1 font-semibold">Kilimani</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Star className="mb-2 h-5 w-5 text-[#F59E0B]" />
                  <p className="text-xs text-white/70">Top rated</p>
                  <p className="mt-1 font-semibold">4.9 / 5</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-3 text-slate-900">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                    alt="Fundi"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">James Kilonzo</p>
                    <p className="text-sm text-slate-500">Verified plumber</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>KES 1,200/day</span>
                  <span className="font-semibold text-[#0D9488]">Available now</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="services" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Home care for every keja need</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {services.map((service) => (
              <Card key={service.name} className="border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="text-3xl">{service.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold">{service.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#0D9488]">How it works</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Simple steps, fast help</h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="border-slate-200 bg-white p-1 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0D9488] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-slate-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="why-us" className="bg-slate-900 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <Zap className="h-8 w-8 text-[#F59E0B]" />
            <h3 className="mt-4 text-xl font-bold">Fast response</h3>
            <p className="mt-3 text-slate-300">Most requests are matched within 20 minutes in major towns and neighborhoods.</p>
          </div>
          <div>
            <ShieldCheck className="h-8 w-8 text-[#F59E0B]" />
            <h3 className="mt-4 text-xl font-bold">Verified & trusted</h3>
            <p className="mt-3 text-slate-300">All service professionals are checked for identity, skills and conduct before listing.</p>
          </div>
          <div>
            <MessageCircle className="h-8 w-8 text-[#F59E0B]" />
            <h3 className="mt-4 text-xl font-bold">Live communication</h3>
            <p className="mt-3 text-slate-300">Chat, track their route, and keep your home improvement job moving without confusion.</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p>© 2026 KejaCare. Fundi mlangoni.</p>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#0D9488]" />
          M-Pesa ready
        </div>
      </footer>
    </main>
  );
}
