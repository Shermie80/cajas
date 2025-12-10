import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ModalProvider } from "@/components/modal-provider";
import AuthModal from "@/components/auth-modal";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-bai-jamjuree'
});

export const metadata: Metadata = {
  title: "Cajas.club",
  description: "Open cases, win skins, provably fair.",
  icons: {
    icon: '/fav.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, fetch their profile to get the custom avatar
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, role')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (profile.avatar_url) {
        user.user_metadata.avatar_url = profile.avatar_url;
      }
      if (profile.role) {
        user.user_metadata.role = profile.role;
      }
    }
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={baiJamjuree.className}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ModalProvider>
            <div className="flex min-h-screen bg-background text-foreground">
              <Sidebar user={user} />
              <div className="flex-1 md:ml-64 flex flex-col transition-all duration-300">
                <Header user={user} />
                <main className="flex-grow pt-24 px-8 pb-8">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
            <AuthModal />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
