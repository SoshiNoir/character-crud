'use client';

import { ReactNode } from 'react';
import Header from './components/Header';
import './globals.css';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='pt-br'>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
