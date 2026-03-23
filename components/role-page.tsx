import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";
import type { CmsData, CmsRolePage } from "@/lib/cms-schema";

type RolePageProps = {
  site: CmsData;
  page: CmsRolePage;
  embedded?: boolean;
  focusSection?: string | null;
  activeCardKey?: string | null;
  activeCardIndex?: number | null;
};

export function RolePage({
  site,
  page,
  embedded = false,
  focusSection = null,
  activeCardKey = null,
  activeCardIndex = null,
}: RolePageProps) {
  return (
    <main className="pb-10">
      <SiteHeader site={site} embedded={embedded} highlighted={focusSection === "header"} />

      <PageHero hero={page.hero} highlighted={focusSection === "hero"} />

      {page.sections.map((section) => (
        <SectionShell key={section.id} section={section} highlighted={focusSection === section.id}>
          <div className="grid gap-5 md:grid-cols-3">
            {section.items.map((item, index) => (
              <FeatureCard
                key={`${section.id}-${item.title}-${index}`}
                item={item}
                icon={item.icon || "•"}
                delay={index * 0.08}
                highlighted={focusSection === section.id && activeCardKey === "role-card" && activeCardIndex === index}
                previewCardKey="role-card"
                previewCardIndex={index}
              />
            ))}
          </div>
        </SectionShell>
      ))}

      <Footer
        site={site}
        highlighted={focusSection === "footer"}
        activeCardKey={focusSection === "footer" ? activeCardKey : null}
        activeCardIndex={focusSection === "footer" ? activeCardIndex : null}
      />
    </main>
  );
}
