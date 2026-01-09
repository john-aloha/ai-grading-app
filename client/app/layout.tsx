import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GradeFlow - AI Grading",
  description: "Automated document grading for teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased text-foreground")}>
        <Navbar />
        <main className="pt-16 min-h-screen relative overflow-hidden">
          {/* Background gradients */}
          <div className="fixed inset-0 -z-10 bg-background">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
