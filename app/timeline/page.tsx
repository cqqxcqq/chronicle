"use client";

import Nav from "@/components/ui/Nav";
import ScrollOrchestrator from "@/components/timeline/ScrollOrchestrator";
import type { ScrollContext } from "@/components/timeline/ScrollOrchestrator";
import TimelineContainer from "@/components/timeline/TimelineContainer";

export default function TimelinePage() {
  return (
    <>
      <Nav />
      <ScrollOrchestrator>
        {(ctx: ScrollContext) => (
          <TimelineContainer
            displayYear={ctx.displayYear}
            milestoneIndex={ctx.milestoneIndex}
            onAdvance={ctx.onAdvance}
            onRetreat={ctx.onRetreat}
            canAdvance={ctx.canAdvance}
            canRetreat={ctx.canRetreat}
          />
        )}
      </ScrollOrchestrator>
    </>
  );
}
