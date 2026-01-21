
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Google Fonts via Next.js
import "./globals.css";
import { Providers } from "@/components/providers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FortTrekker - Explore Maharashtra Forts",
    description:
        "Discover and explore the magnificent forts of Maharashtra. Plan your treks, read reviews, and connect with fellow trekkers.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <Navigation />
                    <div className="min-h-screen flex flex-col">
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
