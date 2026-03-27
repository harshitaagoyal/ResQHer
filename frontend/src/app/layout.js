import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
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
        {/* Added inter.className here to make the font look professional */}
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Any Navbar or headers you have would go here */}
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}