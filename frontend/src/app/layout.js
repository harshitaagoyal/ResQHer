import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
// 🚨 NEW: Import your Navbar component
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ResQHer - Empowering Women's Safety",
  description: "A secure platform for reporting, legal guidance, and community support.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* 🚨 NEW: The Navbar is now locked at the top of the entire application */}
            <Navbar />
            
            {/* The individual pages will load inside this main container below the Navbar */}
            <main>
              {children}
            </main>
            
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}