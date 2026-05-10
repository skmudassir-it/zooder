import { Suspense } from "react";
import { ExploreContent } from "./ExploreContent";

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
          <h1 className="px-4 py-3 text-xl font-bold">Explore</h1>
        </div>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
