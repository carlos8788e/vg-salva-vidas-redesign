import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./auth-screens.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VG Salva Vidas | Gestão hospitalar",
  description:
    "Plataforma segura de gestão hospitalar VG Salva Vidas para cadastro de pacientes, atendimento, internações e altas.",
};

export const viewport: Viewport = {
  themeColor: "#102b3a",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
