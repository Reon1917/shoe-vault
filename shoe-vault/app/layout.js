import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from '../lib/ThemeContext';  // Import ThemeProvider

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

// Metadata for the app
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// RootLayout function with theme support
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>  {/* Wrap the app in ThemeProvider for dark/light mode */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
