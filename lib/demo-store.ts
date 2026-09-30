import { fundis } from "@/lib/mock-data";

export type DemoRole = "client" | "fundi" | "admin";
export type DemoJobStatus =
  | "pending"
  | "accepted"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export type DemoProfile = {
  id: string;
  role: DemoRole;
  name: string;
  phone: string;
  avatar_url?: string | null;
  id_number?: string | null;
  is_verified?: boolean;
  rating?: number;
  price_per_day?: number;
  skills?: string[];
  location_lat?: number | null;
  location_lng?: number | null;
  is_online?: boolean;
  created_at: string;
};

export type DemoJob = {
  id: string;
  client_id: string;
  fundi_id: string;
  service_type: string;
  status: DemoJobStatus;
  client_lat: number;
  client_lng: number;
  fundi_lat: number;
  fundi_lng: number;
  price: number;
  scheduled_at: string;
  created_at: string;
};

export type DemoMessage = {
  id: string;
  job_id: string;
  sender_id: string;
  text: string;
  created_at: string;
};

export type DemoStore = {
  profiles: DemoProfile[];
  jobs: DemoJob[];
  messages: DemoMessage[];
};

const STORAGE_KEY = "kejacare-demo-store";
const SESSION_KEY = "kejacare-demo-session";

const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;

const buildSeedProfiles = (): DemoProfile[] => {
  const now = new Date().toISOString();

  const demoClient: DemoProfile = {
    id: "demo-client",
    role: "client",
    name: "Demo Client",
    phone: "+254700000000",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    is_verified: true,
    rating: 5,
    created_at: now,
  };

  const demoAdmin: DemoProfile = {
    id: "demo-admin",
    role: "admin",
    name: "KejaCare Admin",
    phone: "+254700000099",
    avatar_url: null,
    is_verified: true,
    rating: 5,
    created_at: now,
  };

  const seededFundis = fundis.map((fundi, index) => ({
    id: `fundi_${index + 1}`,
    role: "fundi" as const,
    name: fundi.name,
    phone: `+254700${String(1000 + index).padStart(6, "0")}`,
    avatar_url: fundi.avatar,
    id_number: `ID${1000 + index}`,
    is_verified: fundi.verified,
    rating: fundi.rating,
    price_per_day: fundi.price,
    skills: fundi.skills,
    location_lat: fundi.location.lat,
    location_lng: fundi.location.lng,
    is_online: fundi.online,
    created_at: now,
  }));

  return [demoClient, demoAdmin, ...seededFundis];
};

export const getDemoStore = (): DemoStore => {
  if (typeof window === "undefined") {
    return { profiles: buildSeedProfiles(), jobs: [], messages: [] };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as DemoStore;
      if (parsed && Array.isArray(parsed.profiles)) {
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to parse demo store", error);
    }
  }

  const fresh = { profiles: buildSeedProfiles(), jobs: [], messages: [] };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
};

const saveDemoStore = (next: DemoStore) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("kejacare-demo-change"));
};

export const getCurrentSession = () => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as {
      userId: string;
      role: DemoRole;
      phone: string;
      name: string;
    };
  } catch {
    return null;
  }
};

export const setCurrentSession = (session: {
  userId: string;
  role: DemoRole;
  phone: string;
  name: string;
}) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearCurrentSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const ensureProfileForAuth = ({ phone, role, name }: { phone: string; role: DemoRole; name?: string }) => {
  const store = getDemoStore();
  const existing = store.profiles.find((profile) => profile.phone === phone);

  if (existing) {
    setCurrentSession({
      userId: existing.id,
      role: existing.role,
      phone: existing.phone,
      name: existing.name,
    });
    return existing;
  }

  const newProfile: DemoProfile = {
    id: createId("profile"),
    role,
    name: name ?? (role === "client" ? "Demo Client" : "Demo Fundi"),
    phone,
    avatar_url: null,
    is_verified: role === "admin" ? true : false,
    rating: 4.8,
    price_per_day: role === "fundi" ? 900 : undefined,
    skills: role === "fundi" ? ["cleaning"] : [],
    created_at: new Date().toISOString(),
  };

  store.profiles.unshift(newProfile);
  saveDemoStore(store);
  setCurrentSession({
    userId: newProfile.id,
    role: newProfile.role,
    phone: newProfile.phone,
    name: newProfile.name,
  });

  return newProfile;
};

export const getProfileById = (id: string) => getDemoStore().profiles.find((profile) => profile.id === id);

export const getProfilesByRole = (role: DemoRole) => getDemoStore().profiles.filter((profile) => profile.role === role);

export const updateProfile = (id: string, updates: Partial<DemoProfile>) => {
  const store = getDemoStore();
  const index = store.profiles.findIndex((profile) => profile.id === id);
  if (index === -1) return null;

  store.profiles[index] = { ...store.profiles[index], ...updates };
  saveDemoStore(store);
  return store.profiles[index];
};

export const createJob = ({
  client_id,
  fundi_id,
  service_type,
  price,
  client_lat,
  client_lng,
  scheduled_at,
}: {
  client_id: string;
  fundi_id: string;
  service_type: string;
  price: number;
  client_lat: number;
  client_lng: number;
  scheduled_at?: string;
}) => {
  const store = getDemoStore();
  const fundi = getProfileById(fundi_id);

  const job: DemoJob = {
    id: createId("job"),
    client_id,
    fundi_id,
    service_type,
    status: "pending",
    client_lat,
    client_lng,
    fundi_lat: fundi?.location_lat ?? -1.3733,
    fundi_lng: fundi?.location_lng ?? 37.9709,
    price,
    scheduled_at: scheduled_at ?? new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  store.jobs.unshift(job);
  saveDemoStore(store);
  return job;
};

export const updateJob = (jobId: string, updates: Partial<DemoJob>) => {
  const store = getDemoStore();
  const index = store.jobs.findIndex((job) => job.id === jobId);
  if (index === -1) return null;

  store.jobs[index] = { ...store.jobs[index], ...updates };
  saveDemoStore(store);
  return store.jobs[index];
};

export const getJobsForClient = (clientId: string) => getDemoStore().jobs.filter((job) => job.client_id === clientId);

export const getIncomingJobsForFundi = (fundiId: string) =>
  getDemoStore().jobs.filter((job) => job.fundi_id === fundiId && ["pending", "accepted", "en_route", "arrived", "in_progress"].includes(job.status));

export const getJobById = (jobId: string) => getDemoStore().jobs.find((job) => job.id === jobId) ?? null;

export const addMessage = ({ job_id, sender_id, text }: { job_id: string; sender_id: string; text: string }) => {
  const store = getDemoStore();
  const message: DemoMessage = {
    id: createId("msg"),
    job_id,
    sender_id,
    text,
    created_at: new Date().toISOString(),
  };

  store.messages.unshift(message);
  saveDemoStore(store);
  return message;
};

export const getMessagesForJob = (jobId: string) =>
  getDemoStore().messages.filter((message) => message.job_id === jobId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

export const setDemoRealtimeTick = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("kejacare-demo-change", handler);
  return () => window.removeEventListener("kejacare-demo-change", handler);
};
