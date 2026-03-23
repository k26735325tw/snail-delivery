import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";
import type { CmsData, CmsRolePage } from "@/lib/cms-schema";

type RolePageProps = {
  site: CmsData;
  page: CmsRolePage;
};

export function RolePage({ site, page }: RolePageProps) {
  return (
    <main className="pb-10">
      <SiteHeader site={site} />

      <PageHero hero={page.hero} />

      {page.sections.map((section) => (
        <SectionShell key={section.id} section={section}>
          <div className="grid gap-5 md:grid-cols-3">
            {section.items.map((item, index) => (
              <FeatureCard
                key={`${section.id}-${item.title}-${index}`}
                item={item}
                icon={item.icon || "•"}
                delay={index * 0.08}
              />
            ))}
          </div>
        </SectionShell>
      ))}

      <Footer site={site} />
    </main>
  );
}
