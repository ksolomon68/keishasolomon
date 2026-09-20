import { getCurrentUser } from "@/lib/auth/session";
import { Brand } from "./brand";
import { SiteNav, type NavLink } from "./site-nav";

const links: NavLink[] = [
  { href: "/#method", label: "Method" },
  { href: "/#syllabus", label: "Syllabus" },
  { href: "/onboarding", label: "Before Day 1" },
  { href: "/#safe-harbor", label: "Safe Harbor" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <header data-surface="dark" className="sticky top-0 z-40 border-b border-white/10 bg-navy-950 text-white">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <SiteNav links={links} account={user ? { name: user.name, isAdmin: user.role === "admin" } : null} />
      </div>
    </header>
  );
}
