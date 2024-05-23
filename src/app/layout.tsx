import { ThemeProvider } from "@/components/themeProvider/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import TanstackProvider from "@/TanstackProvider/TanstackProvider";
import { Toaster } from "@/components/ui/toaster";
import UserContextProvider from "@/context/UserContext/UserContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      
      <body className={inter.className}>
        <UserContextProvider>
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              themes={["dark", "light", "orange"]}
              disableTransitionOnChange
            >
              <Header></Header>
              {children}
              <Toaster/>
              <Footer></Footer>
            </ThemeProvider>
          </TanstackProvider>
        </UserContextProvider>
      </body>
      
    </html>
  );
}
