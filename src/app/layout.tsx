
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "@/contexts/auth-context";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "GearNest | Equipment Rental Platform",
  description:
    "Rent quality equipment easily with GearNest. Discover, book, and manage equipment rentals in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-white">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Suspense fallback={<div className="h-16" />}>
                <Navbar />
              </Suspense>

              <main className="min-w-0 flex-1">
                {children}
              </main>

              <Footer />
            </div>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
