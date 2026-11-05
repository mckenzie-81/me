import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import {
  getExperience,
  getProfile,
  getProjects,
  getSiteMeta,
  getStack,
} from "@/lib/content";

export default async function HomePage() {
  // Fetched in parallel rather than sequentially. They are local reads today,
  // but these become database queries once /cms exists and the waterfall would
  // start costing real time.
  const [meta, profile, projects, experience, stack] = await Promise.all([
    getSiteMeta(),
    getProfile(),
    getProjects(),
    getExperience(),
    getStack(),
  ]);

  return (
    <>
      <Header meta={meta} knownAs={profile.knownAs} />

      <main>
        <Hero profile={profile} />
        <Work projects={projects} />
        <About profile={profile} stack={stack} />
        <Experience items={experience} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />
    </>
  );
}
