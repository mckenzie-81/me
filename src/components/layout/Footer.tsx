import { Container } from "@/components/ui/Container";
import type { Profile } from "@/content/types";
import { getCurrentYear } from "@/lib/content";

export async function Footer({ profile }: { profile: Profile }) {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-rule py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-ink-faint">
          © {year} {profile.name}. Built with Next.js.
        </p>
        <ul className="flex items-center gap-5">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-xs text-ink-soft transition-colors hover:text-blue"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
