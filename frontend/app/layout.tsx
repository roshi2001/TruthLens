import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TruthLens — Real-Time Misinformation Detection",
  description: "AI-powered misinformation detection pipeline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="glass fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center glow-blue">
              <span className="text-white font-bold text-sm">TL</span>
            </div>
            <span className="font-bold text-lg gradient-text">TruthLens</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="/" className="hover:text-white transition-colors">Analyze</a>
            <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="/performance" className="hover:text-white transition-colors">Performance</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-slate-400">Pipeline Active</span>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}