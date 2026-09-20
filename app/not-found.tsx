import type { Metadata } from "next";
import Link from "next/link";

// Without this override the 404 page inherits the root layout's canonical and
// tells Google that every unknown URL is the homepage, which is how a site
// manufactures the duplicates Search Console then complains about.
export const metadata: Metadata = {
  title: "Page not found — Adem Brouri, P.Eng.",
  // Next already emits `noindex` for this route, so only the canonical needs
  // clearing.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-24 text-center">
      <p className="font-mono text-sm tracking-widest text-neutral-500 uppercase">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        That page does not exist.
      </h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        The link may be out of date, or the address mistyped.
      </p>
      <Link
        href="/"
        className="mx-auto mt-8 rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        Back to the homepage
      </Link>
    </main>
  );
}
