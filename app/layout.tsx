import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import FollowBar from "@/components/sidebar/FollowBar";
import Sidebar from "@/components/sidebar/Sidebar";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import EditModal from "@/components/modals/EditModal";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Twitter Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <NextTopLoader color="blue"/>
        <SessionProvider>

          <Toaster />
          <LoginModal />
          <RegisterModal />
          <EditModal />

          <div className="bg-black pb-10">
            <div className="container h-full mx-auto">
              <div className="relative grid grid-cols-4">
                <Sidebar />

                <div className="col-span-3 lg:col-span-2 border-x border-neutral-800">
                  {children}
                </div>

                <FollowBar />

              </div>

            </div>

          </div>

        </SessionProvider>

      </body>
    </html>
  );
}
