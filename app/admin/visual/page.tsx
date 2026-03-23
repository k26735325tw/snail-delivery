import { CmsVisualEditor } from "@/components/cms-visual-editor";
import { getCmsData } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminVisualPage() {
  const cms = await getCmsData();

  return <CmsVisualEditor initialData={cms} />;
}
