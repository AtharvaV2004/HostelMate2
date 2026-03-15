import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HostelMate Delivery',
  description: 'Peer-to-peer hostel logistics app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0F1412] text-[#F9FAFB] antialiased`} suppressHydrationWarning>
        <div className="min-h-screen bg-black flex justify-center items-center">
          {children}
        </div>
      </body>
    </html>
  );
}
