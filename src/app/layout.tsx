import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { SITE_TITLE } from '@/consts';

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
  return (
    <html
      lang="en"
      className={`${frauncesDisplay.variable} ${DMsans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex justify-between items-center px-3 py-2.5 gap-2.5">
          <Image 
            src="/assets/logo-bright.png"
            width={400}
            height={95}
            alt={`${SITE_TITLE} Logo`}
          />
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

        <main itemProp="mainContentOfPage">
          <div className="max-w-[1200px] mx-auto">{children}</div>
        </main>
        
      </body>
    </html>
  );
}
