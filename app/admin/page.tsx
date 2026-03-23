import { AdminDashboard } from "@/components/admin-dashboard";
import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cms = await getCmsData();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            CMS V2 後台
          </p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">Snail Delivery 可視化繁中編輯器</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            這個後台會將內容 JSON 與圖片寫入 Vercel Blob，儲存後同步重新整理首頁與角色頁。
          </p>
        </section>

        <AdminDashboard initialData={cms} />
      </div>
    </main>
  );
}
