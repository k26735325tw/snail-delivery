import { updateSiteContent } from "@/app/admin/actions";
import { readSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const siteData = await readSiteData();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-black">GoGet Content Admin</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Edit the homepage hero title and subtitle here. Saving this form
            updates
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-xs">
              data/site.json
            </code>
            and refreshes the homepage content.
          </p>

          <form action={updateSiteContent} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">Hero title</span>
              <input
                name="heroTitle"
                defaultValue={siteData.heroTitle}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Hero subtitle
              </span>
              <textarea
                name="heroSubtitle"
                defaultValue={siteData.heroSubtitle}
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="inline-flex rounded-full bg-blue px-6 py-3 text-sm font-bold text-white transition hover:bg-blue/90"
            >
              Save
            </button>
          </form>
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
