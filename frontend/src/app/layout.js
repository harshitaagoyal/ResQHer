import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ResQHer - Empowering Women's Safety",
  description: "A secure platform for reporting, legal guidance, and community support.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-white">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}