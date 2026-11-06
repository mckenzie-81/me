import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";

import { Intro } from "@/components/intro/Intro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { INTRO_SEEN_KEY } from "@/lib/loader/intro";
import { THEME_KEY } from "@/lib/theme";
import { site } from "@/site";

import "./globals.css";

/**
 * One typeface, variable, self-hosted by next/font at build time — so there is
 * no request to Google at runtime and no layout shift from a late swap.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

/**
 * Runs before first paint, synchronously, in the document head.
 *
 * Three things have to be decided before anything renders, and all three are
 * only knowable on the client:
 *
 *   data-theme              light or dark. In an effect this would flash the
 *                           wrong theme on every single page load.
 *   data-intro="play"       whether the intro runs. In an effect a repeat
 *                           visitor sees one frame of curtain.
 *   data-animate="true"     whether anything may animate at all.
 *
 * The theme rule here mirrors `resolveTheme` in lib/theme.ts, which is where
 * it is tested. It is duplicated rather than imported because this executes as
 * a string before any bundle has loaded — the one place in the codebase where
 * that trade is worth making.
 *
 * The catch-all is biased on purpose: on any failure, a readable light page
 * with no intro. The page may lose its intro; it can never be trapped behind
 * one.
 */
const headScript = `(function(){
  var d=document.documentElement;
  try{
    var t=null;
    try{t=window.localStorage.getItem(${JSON.stringify(THEME_KEY)});}catch(e){}
    var dark=window.matchMedia("(prefers-color-scheme: dark)").matches;
    d.setAttribute("data-theme",(t==="light"||t==="dark")?t:(dark?"dark":"light"));

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
    d.setAttribute("data-theme","light");
    d.setAttribute("data-intro-state","done");
  }
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above mutates <html> before React
    // hydrates, so the attribute sets legitimately differ.
    <html lang="en" className={display.variable} suppressHydrationWarning>
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
