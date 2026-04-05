import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/home/Navbar";
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
            <Navbar />
            
            <main>
              {children}
            </main>
            
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}