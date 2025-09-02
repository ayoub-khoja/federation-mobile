import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "../components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Direction Nationale de l'Arbitrage - FTF",
  description: "Système de connexion pour la Direction Nationale de l'Arbitrage de la Fédération Tunisienne de Football",
  icons: {
    icon: [
      { url: '/ftf-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/ftf-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/ftf-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/ftf-logo.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/ftf-logo.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/ftf-logo.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/ftf-logo.png?v=2" />
        <link rel="shortcut icon" href="/ftf-logo.png?v=2" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body className="antialiased font-sans">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
