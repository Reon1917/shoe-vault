import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from '../lib/ThemeContext'; 
import AuthProvider from '@/components/AuthProvider';
import Head from "next/head"; 

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Shoe Vault',
  description: 'Your personal shoe collection manager',
};

// RootLayout function with theme support
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../shoevault.png" type="image/png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>  {/* Wrap the app in ThemeProvider for dark/light mode */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
