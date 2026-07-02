import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Orbitra — Every Satellite Has a Story",
    template: "%s | Orbitra",
  },
  description:
    "A cinematic satellite tracking experience. Follow thousands of satellites orbiting Earth, discover their stories, and explore the skies like never before.",
  keywords: [
    "satellite tracker",
    "orbit visualization",
    "space",
    "3D globe",
    "satellite stories",
    "ISS tracker",
    "orbital mechanics",
  ],
  authors: [{ name: "Orbitra" }],
  openGraph: {
    title: "Orbitra — Every Satellite Has a Story",
    description: "A cinematic satellite tracking experience.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030315",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-void-900 text-white antialiased overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
