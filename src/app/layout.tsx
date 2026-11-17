import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { getImageProps } from "next/image";
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts';
import { getMoonState } from '@/lib/moon';
import ExternalLink from '@/components/ExternalLink';
import SiteNav from '@/components/SiteNav';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/ssr';

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
  metadataBase: new URL("https://brightsidemoon.vercel.app/"),
  title: {
    default: "Look on the Bright✦Side",
    template: "%s ✦ Look on the Bright✦Side",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: "KokoNekoArt", url: "https://kokoneko.art" }],
  openGraph: {
    type: "website",
    siteName: "Look on the Bright✦Side",
    locale: "en_CA",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  appleWebApp: { title: "Bright✦Side" },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#101C3B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const moon = getMoonState();

  return (
    <html
      lang="en"
      className={`${frauncesDisplay.variable} ${DMsans.variable} h-full antialiased`}
    >
      <body data-moon-mode={moon.mode} className="min-h-screen overflow-x-hidden flex flex-col">
        <div aria-hidden="true" className="site-bg pointer-events-none fixed top-0 left-0 -z-20 h-lvh w-full" />
        <header className="flex justify-between items-center px-5 py-3 gap-2.5 overflow-x-clip">
          <Link href="/">
            <picture>
              <source media="(min-width: 64rem)" srcSet={logoDesktop} />
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img {...logoMobile} className="h-[70px] w-auto lg:h-[94px]" />
            </picture>
          </Link>
          <SiteNav />
        </header>

        <main className="grow" itemProp="mainContentOfPage">
          <div className="container max-w-[1200px] mx-auto mt-5 px-2.5 md:px-0">{children}</div>
        </main>

        <footer className="flex justify-between items-center px-3 py-2.5 gap-2.5">
              <div></div>
              <p className="flex items-center gap-2">Thoughtfully made by <ExternalLink href="https://kokoneko.art" className="flex items-center gap-1">KokoNekoArt <ArrowSquareOutIcon aria-hidden="true" className="size-3"/></ExternalLink> in 2026
              <span className="inline-block drop-shadow-[0_0_25px_rgb(var(--body))]">
                <span className="block h-5 w-4 bg-body [mask:url(/assets/star.svg)_center/contain_no-repeat]" />
              </span>
              <Link href="/attribution">Attributions</Link>
              </p>
              <div></div>
        </footer>

        <span id="external-hint" className="sr-only">(opens in a new window)</span>
        
      </body>
    </html>
  );
}
