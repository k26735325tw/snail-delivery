import { CmsVisualEditor } from "@/components/cms-visual-editor";
import { getCmsSnapshot } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminVisualPage() {
  const cms = await getCmsSnapshot();

  return <CmsVisualEditor initialData={cms.data} initialStatus={cms.status} />;
}
