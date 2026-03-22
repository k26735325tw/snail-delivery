import { AdminDashboard } from "@/components/admin-dashboard";
import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cms = await getCmsData();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            CMS Backoffice
          </p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">Snail Delivery Admin</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            This dashboard writes CMS JSON to Vercel Blob, supports image upload,
            and revalidates the homepage plus all role landing pages after save.
          </p>
        </section>

        <AdminDashboard initialData={cms} />
      </div>
    </main>
  );
}
