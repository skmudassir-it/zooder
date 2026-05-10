import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { RightPanel } from "@/components/layout/RightPanel";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-2xl mx-auto w-full pb-16 md:pb-0">
        {children}
      </main>
      <RightPanel />
      <MobileNav />
    </div>
  );
}
