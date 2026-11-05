import type { Metadata } from "next";

import { Intro } from "@/components/intro/Intro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { INTRO_SEEN_KEY } from "@/lib/loader/intro";
import { site } from "@/site";

import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

/**
 * Runs before first paint, synchronously, in the document head.
 *
 * This is the single place the intro is decided, and it has to be here. An
 * effect runs after first paint, so a repeat visitor would see one frame of
 * curtain, and someone with reduced motion would see the thing they asked not
 * to see.
 *
 * It writes attributes on <html> that everything downstream reads:
 *
 *   data-intro="play"       the intro will run: overlay visible, scroll locked
 *   data-intro-state="done" skipped; the page is free immediately
 *
 * The catch-all is biased on purpose: on ANY failure it marks the intro done.
 * The page may lose its intro; it can never be trapped behind one.
 */
const headScript = `(function(){
  var d=document.documentElement;
  try{
    var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above mutates <html> before React
    // hydrates, so the attribute sets legitimately differ.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <SmoothScroll>
          {/* Inside SmoothScroll so the intro can stop and restart Lenis
              directly rather than relying on CSS to hold the page still. */}
          <Intro word={site.knownAs} />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
