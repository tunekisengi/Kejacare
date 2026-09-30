import { Check, ShieldCheck, TrendingUp } from "lucide-react";
import { adminUsers, jobRecords } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0D9488]">Admin</p>
            <h1 className="text-xl font-bold text-slate-900">KejaCare operations</h1>
          </div>
          <Button>Export report</Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Verified fundis</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-[#0D9488]" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Total jobs</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">3,280</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#F59E0B]" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Commission</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">KES 204,800</p>
              </div>
              <Check className="h-8 w-8 text-emerald-600" />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Verification queue</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Rating</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr key={user.name} className="border-t border-slate-200">
                    <td className="p-3 font-medium text-slate-900">{user.name}</td>
                    <td className="p-3 text-slate-600">{user.role}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.status === "Verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{user.rating}</td>
                    <td className="p-3">
                      <Button size="sm" variant={user.status === "Verified" ? "outline" : "default"}>
                        {user.status === "Verified" ? "Review" : "Verify"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs overview</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 font-medium">Job ID</th>
                  <th className="p-3 font-medium">Client</th>
                  <th className="p-3 font-medium">Fundi</th>
                  <th className="p-3 font-medium">Service</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Commission</th>
                </tr>
              </thead>
              <tbody>
                {jobRecords.map((job) => (
                  <tr key={job.id} className="border-t border-slate-200">
                    <td className="p-3 font-medium text-slate-900">{job.id}</td>
                    <td className="p-3 text-slate-700">{job.client}</td>
                    <td className="p-3 text-slate-700">{job.fundi}</td>
                    <td className="p-3 text-slate-700">{job.service}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {job.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{job.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
