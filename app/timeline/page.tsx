"use client";

import Nav from "@/components/ui/Nav";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ScrollOrchestrator from "@/components/timeline/ScrollOrchestrator";
import type { ScrollContext } from "@/components/timeline/ScrollOrchestrator";
import TimelineContainer from "@/components/timeline/TimelineContainer";
import TimelineBar from "@/components/timeline/TimelineBar";

export default function TimelinePage() {
  return (
    <ErrorBoundary>
      <Nav />
      <ScrollOrchestrator>
        {(ctx: ScrollContext) => (
          <>
            <TimelineContainer
              displayYear={ctx.displayYear}
              milestoneIndex={ctx.milestoneIndex}
            />
            <TimelineBar
              currentYear={ctx.displayYear}
              onYearChange={ctx.onYearChange}
              onSnapToMilestone={ctx.onSnapToMilestone}
            />
          </>
        )}
      </ScrollOrchestrator>
    </ErrorBoundary>
  );
}
