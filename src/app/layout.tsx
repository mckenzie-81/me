import type { Metadata } from "next";

import { Intro } from "@/components/intro/Intro";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { getProfile, getSiteMeta } from "@/lib/content";
import { INTRO_SEEN_KEY } from "@/lib/loader/intro";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  // Metadata comes from the same content layer as the page, so editing the site
  // title in the CMS later updates the <title> tag too, with no second place to
  // remember.
  const meta = await getSiteMeta();

  return {
    metadataBase: new URL(meta.url),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: meta.url,
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Runs before first paint, synchronously, in the document head.
 *
 * This is the single place the intro is decided, and it has to be here. An
 * effect in a client component runs after first paint, so a repeat visitor
 * would see one frame of curtain before it was removed, and someone with
 * reduced motion would see the thing they asked not to see.
 *
 * It writes three attributes on <html>, and everything downstream reads them:
 *
 *   data-animate="true"     motion is welcome, so reveal targets start hidden
 *   data-intro="play"       the intro is going to run; the overlay is visible
 *                           and scrolling is locked
 *   data-intro-state="done" the gate is already open; reveals may run at once
 *
 * The catch-all is deliberately biased: on ANY failure it marks the intro
 * done. The page may lose its intro, but it can never be trapped behind one.
 */
const headScript = `(function(){
  var d=document.documentElement;
  try{
    var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!reduced){d.setAttribute("data-animate","true");}
    var seen=false;
    try{seen=window.sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})==="1";}catch(e){}
    if(!reduced&&!seen){
      d.setAttribute("data-intro","play");
      d.setAttribute("data-loading","true");
    }else{
      d.setAttribute("data-intro-state","done");
    }
  }catch(e){
    d.setAttribute("data-intro-state","done");
  }
})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();

  return (
    // suppressHydrationWarning: the script above mutates <html> before React
    // hydrates, so the server and client attribute sets legitimately differ.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-raised focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <SmoothScroll>
          {/* Inside SmoothScroll so the intro can stop and restart Lenis
              directly, rather than relying on CSS overflow to hold a
              smooth-scrolled page still. */}
          <Intro word={profile.knownAs.toLowerCase()} />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
