import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-sm text-subtle">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Built with Next.js and Tailwind CSS</span>
      </div>
    </footer>
  );
}
