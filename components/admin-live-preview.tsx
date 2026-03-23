"use client";

import { useEffect, useRef, useState } from "react";

import { RolePage } from "@/components/role-page";
import { SiteHome } from "@/components/site-home";
import type { CmsData } from "@/lib/cms-schema";

export type PreviewPage = "home" | "consumer" | "courier" | "merchant";
export type PreviewTarget = {
  page: PreviewPage;
  section: string | null;
};

type AdminLivePreviewProps = {
  site: CmsData;
  viewport: "desktop" | "mobile";
  target: PreviewTarget;
};

function getCanvasWidth(viewport: "desktop" | "mobile") {
  return viewport === "mobile" ? 390 : 1280;
}

export function AdminLivePreview({ site, viewport, target }: AdminLivePreviewProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const content = contentRef.current;

    if (!outer || !content) {
      return;
    }

    const canvasWidth = getCanvasWidth(viewport);

    const update = () => {
      const nextScale = Math.min((outer.clientWidth - 24) / canvasWidth, 1);
      setScale(nextScale);
      setCanvasHeight(content.scrollHeight * nextScale);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(content);

    return () => observer.disconnect();
  }, [viewport, site, target]);

  const canvasWidth = getCanvasWidth(viewport);

  return (
    <div ref={outerRef} className="h-full overflow-auto rounded-[2rem] border border-slate-200 bg-slate-100 p-3">
      <div style={{ height: `${canvasHeight || 1}px` }}>
        <div
          style={{
            width: `${canvasWidth}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
          className="mx-auto"
        >
          <div ref={contentRef} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            {target.page === "home" ? (
              <SiteHome
                site={site}
                embedded
                previewViewport={viewport}
                focusSection={target.section as "header" | "hero" | "features" | "launch-flow" | "footer" | null}
              />
            ) : (
              <RolePage
                site={site}
                page={site[target.page]}
                embedded
                focusSection={target.section}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
