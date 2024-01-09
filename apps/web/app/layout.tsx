import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Phaser Games',
  description: 'Games made with Phaser JS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} ${styles.body}`}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
