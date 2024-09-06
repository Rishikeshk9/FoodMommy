'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalStore from './contexts/globalContext';
import { SessionProvider } from 'next-auth/react';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <title>Kaykhau | Simplifying Meal Decisions</title>
      <body className='scrollbar-none '>
        <SessionProvider>
          <GlobalStore>{children}</GlobalStore>{' '}
        </SessionProvider>
      </body>
      {/* <script
        type='module'
        src='https://unpkg.com/@layflags/rolling-number@1.0.0/rolling-number.js'
      ></script> */}
    </html>
  );
}
