import type { Metadata } from 'next';
import './globals.css';
import styles from './layout.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiHome, FiCalendar, FiUsers, FiFlag, FiAward, FiTool, FiBook } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'MHS Golf Dayz',
  description: 'League management hub for the MHS Golf Dayz fantasy golf league'
};

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: FiHome },
  { href: '/schedule', label: 'Schedule', icon: FiCalendar },
  { href: '/players', label: 'Players', icon: FiUsers },
  { href: '/majors', label: 'Majors', icon: FiFlag },
  { href: '/standings', label: 'Standings', icon: FiAward },
  { href: '/commissioner', label: 'Commish', icon: FiTool },
  { href: '/rules', label: 'Rules', icon: FiBook }
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.shell}>
          <aside className={styles.sidebar} aria-label="Primary">
            <div className={styles.logo}>MHS Golf Dayz</div>
            <nav>
              <ul>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={styles.navLink}>
                        <Icon aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
          <main className={styles.main}>{children}</main>
          <nav className={styles.mobileNav} aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={styles.mobileLink}>
                  <Icon aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </body>
    </html>
  );
}
