import { cacheLife, cacheTag } from "next/cache";

import { experience } from "@/content/experience";
import { profile, siteMeta } from "@/content/profile";
import { projects } from "@/content/projects";
import { stack } from "@/content/stack";
import type {
  ExperienceItem,
  Profile,
  Project,
  SiteMeta,
  StackGroup,
} from "@/content/types";

/**
 * The content access layer — the seam between the public page and the CMS.
 *
 * Right now every getter reads a local module under `src/content`. Later, when
 * /cms is real, only the bodies of these functions change (to a DB query, a
 * fetch, whatever). Components await the same async signatures either way, so
 * nothing in the UI has to be rewritten.
 *
 * `"use cache"` matters here: `cacheComponents` is enabled in next.config.ts, so
 * these results are cached at build/request time and tagged. When the CMS saves
 * an edit it calls `revalidateTag(CONTENT_TAGS.<x>)` and only that slice of the
 * page is regenerated. That is the whole reason to pay the async tax now.
 */

export const CONTENT_TAGS = {
  profile: "content:profile",
  projects: "content:projects",
  experience: "content:experience",
  stack: "content:stack",
  meta: "content:meta",
} as const;

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getSiteMeta(): Promise<SiteMeta> {
  "use cache";
  cacheTag(CONTENT_TAGS.meta);
  return siteMeta;
}

export async function getProfile(): Promise<Profile> {
  "use cache";
  cacheTag(CONTENT_TAGS.profile);
  return profile;
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.projects);
  // Featured first, then by explicit order — so the CMS can reorder without
  // the component knowing anything about sorting.
  return [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || byOrder(a, b),
  );
}

export async function getExperience(): Promise<ExperienceItem[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.experience);
  return [...experience].sort(byOrder);
}

export async function getStack(): Promise<StackGroup[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.stack);
  return [...stack].sort(byOrder);
}

/**
 * The copyright year.
 *
 * `new Date()` cannot be called directly in a prerendered component: with
 * `cacheComponents` enabled Next refuses to bake a value that changes between
 * renders into static output. Reading it inside a cached function with an
 * explicit lifetime is the sanctioned way — the year is prerendered, and
 * revalidates within a day of actually changing.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
