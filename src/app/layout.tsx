import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "../components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Direction Nationale de l'Arbitrage - FTF",
  description: "Système de connexion pour la Direction Nationale de l'Arbitrage de la Fédération Tunisienne de Football",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased font-sans">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
