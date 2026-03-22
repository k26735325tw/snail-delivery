import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { SectionShell } from "@/components/section-shell";
import { SiteHeader } from "@/components/site-header";
import type { CmsRolePage } from "@/lib/cms-schema";

type RolePageProps = {
  siteName: string;
  logoUrl: string;
  footerTitle: string;
  footerDescription: string;
  page: CmsRolePage;
};

export function RolePage({
  siteName,
  logoUrl,
  footerTitle,
  footerDescription,
  page,
}: RolePageProps) {
  return (
    <main className="pb-10">
      <SiteHeader siteName={siteName} logoUrl={logoUrl} />

      <PageHero
        badge={page.hero.badge}
        title={page.hero.title}
        description={page.hero.description}
        primaryHref={page.hero.primaryHref}
        primaryLabel={page.hero.primaryLabel}
        secondaryHref={page.hero.secondaryHref}
        secondaryLabel={page.hero.secondaryLabel}
        asideTitle={page.hero.asideTitle}
        stats={page.hero.stats}
        heroImageUrl={page.hero.heroImageUrl}
      />

      {page.sections.map((section) => (
        <SectionShell
          key={section.id}
          id={section.id}
          badge={section.badge}
          title={section.title}
          description={section.description}
        >
          <div className="grid gap-5 md:grid-cols-3">
            {section.items.map((item, index) => (
              <FeatureCard
                key={`${section.id}-${item.title}-${index}`}
                eyebrow={item.eyebrow ?? "Highlight"}
                title={item.title}
                description={item.description}
                icon={item.icon || "•"}
                delay={index * 0.08}
              />
            ))}
          </div>
        </SectionShell>
      ))}

      <Footer
        siteName={siteName}
        title={footerTitle}
        description={footerDescription}
      />
    </main>
  );
}
