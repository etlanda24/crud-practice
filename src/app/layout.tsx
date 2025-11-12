import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Post Manager',
  description: 'A CRUD app for managing blog posts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
        <footer className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-muted-foreground">
          <Link href="/prd" className="text-sm hover:underline">View Product Requirements Document</Link>
        </footer>
      </body>
    </html>
  );
}
