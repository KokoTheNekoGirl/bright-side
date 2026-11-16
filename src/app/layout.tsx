import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { getImageProps } from "next/image";
import { SITE_TITLE } from '@/consts';
import { getMoonState } from '@/lib/moon';
import ExternalLink from '@/components/ExternalLink';

const logoCommon = { alt: `${SITE_TITLE} Logo`, fetchPriority: 'high' as const };

const {
  props: { srcSet: logoDesktop },
} = getImageProps({ ...logoCommon, src: '/assets/logo-bright.png', width: 400, height: 94 });

const { props: logoMobile } = getImageProps({
  ...logoCommon,
  src: '/assets/logo-bright-mobile.png',
  width: 160,
  height: 70,
});

// Recalculate the moon (and the body mode) at most once an hour
export const revalidate = 3600;

const frauncesDisplay = Fraunces({
  variable: "--font-fraunces-display",
  subsets: ["latin"],
});

const DMsans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Look on the Bright Side",
  description: "Thoughtfully crafted by KokoNekoArt.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  const moon = getMoonState();

  return (
    <html
      lang="en"
      className={`${frauncesDisplay.variable} ${DMsans.variable} h-full antialiased`}
    >
      <body data-moon-mode={moon.mode} className="min-h-screen overflow-x-hidden flex flex-col">
        <header className="flex justify-between items-center px-3 py-2.5 gap-2.5">
          <picture>
          <source media="(min-width: 64rem)" srcSet={logoDesktop} />
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img {...logoMobile} className="h-[70px] w-auto lg:h-[94px]" />
        </picture>
          <nav id="site-nav" className="site-nav" aria-label="Main" itemScope itemType="https://schema.org/SiteNavigationElement">
            {/* <button id="menu-toggle" className="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-list" aria-label="Open main menu">
                <i id="menu-icon" className="fa-solid" aria-hidden="true"></i>
            </button>
            <div className="menu-main-menu-container">
                <ul className="menu" id="menu-list">
                    <li className="menu-item"></li>
                </ul>
            </div> */}
        </nav>
        </header>

        <main className="grow" itemProp="mainContentOfPage">
          <div className="container max-w-[1200px] mx-auto mt-5 px-2.5 md:px-0">{children}</div>
        </main>

        <footer className="flex justify-between items-center px-3 py-2.5 gap-2.5">
              <div></div>
              <p><ExternalLink href="https://kokoneko.art">KokoNekoArt</ExternalLink> © 2026</p>
              <div></div>
        </footer>

        <span id="external-hint" className="sr-only">(opens in a new window)</span>
        
      </body>
    </html>
  );
}
