import { AdminForm } from "@/components/admin-form";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const siteData = await getSiteData();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-black">GoGet CMS Admin</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Edit the homepage content here. The form sends a POST request to
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-xs">
              /api/site
            </code>
            and writes the result into
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-xs">
              data/site.json
            </code>
            .
          </p>

          <AdminForm initialData={siteData} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow">
            Current JSON
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm leading-7 text-slate-200">
            {JSON.stringify(siteData, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
