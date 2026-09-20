"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { buttonStyles } from "@/components/ui/button";

export interface NavLink {
  href: string;
  label: string;
}

interface SiteNavProps {
  links: NavLink[];
  /** null when signed out. */
  account: { name: string; isAdmin: boolean } | null;
}

export function SiteNav({ links, account }: SiteNavProps) {
  const pathname = usePathname();
  // The menu is "open for" the path it was opened on, so navigating elsewhere closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (next: boolean) => setOpenPath(next ? pathname : null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close with Escape, returning focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (href: string) =>
    `rounded-sm px-3 py-2 text-[0.9375rem] transition-colors hover:text-amber ${
      pathname === href ? "text-amber" : "text-white"
    }`;

  const accountLinks = account ? (
    <>
      <Link href="/dashboard" className={linkClass("/dashboard")} aria-current={pathname === "/dashboard" ? "page" : undefined}>
        Dashboard
      </Link>
      {account.isAdmin && (
        <Link href="/admin" className={linkClass("/admin")} aria-current={pathname === "/admin" ? "page" : undefined}>
          Instructor
        </Link>
      )}
      <form action={logoutAction}>
        <button type="submit" className={buttonStyles({ variant: "outline", size: "sm" }) + " text-white"}>
          Sign out
        </button>
      </form>
    </>
  ) : (
    <>
      <Link href="/login" className={buttonStyles({ variant: "outline", size: "sm" }) + " text-white"}>
        Sign in
      </Link>
      <Link href="/register" className={buttonStyles({ variant: "primary", size: "sm" })}>
        Join the cohort
      </Link>
    </>
  );

  return (
    <>
      <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={linkClass(l.href)} aria-current={pathname === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
        <span className="mx-2 h-5 w-px bg-white/25" aria-hidden="true" />
        <div className="flex items-center gap-2">{accountLinks}</div>
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-sm border border-white/30 text-white lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-white/15 bg-navy-950 px-4 pb-6 pt-3 shadow-2xl lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-b border-white/10 py-3.5 text-lg text-white hover:text-amber"
              aria-current={pathname === l.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-5 flex flex-wrap items-center gap-3">{accountLinks}</div>
          {account && <p className="mt-4 text-sm text-on-navy">Signed in as {account.name}</p>}
        </nav>
      </div>
    </>
  );
}
