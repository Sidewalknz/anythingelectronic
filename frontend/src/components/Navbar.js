'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className={`${styles.header} ${styles.atTop}`}>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <div className={styles.topRail} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.brandWrap}>
          <nav className={styles.centerNav} aria-label="Primary">
            <div className={styles.dock}>
              <div className={styles.dockContent}>
                <ul className={`${styles.centerList} ${styles.centerLeft}`}>
                  <li>
                    <Link
                      href="/products"
                      className={`${styles.link} ${isActive('/products') ? styles.active : ''}`}
                      aria-current={isActive('/products') ? 'page' : undefined}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicing"
                      className={`${styles.link} ${isActive('/servicing') ? styles.active : ''}`}
                      aria-current={isActive('/servicing') ? 'page' : undefined}
                    >
                      Servicing
                    </Link>
                  </li>
                </ul>

                <Link
                  href="/"
                  className={styles.logoLink}
                  aria-label="Go to Anything Electronic home"
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  <Image
                    src="/icons/logo.svg"
                    alt="Anything Electronic logo"
                    width={320}
                    height={100}
                    priority
                    className={styles.logoImg}
                  />
                </Link>

                <ul className={`${styles.centerList} ${styles.centerRight}`}>
                  <li>
                    <Link
                      href="/rnd"
                      className={`${styles.link} ${isActive('/rnd') ? styles.active : ''}`}
                      aria-current={isActive('/rnd') ? 'page' : undefined}
                    >
                      Research
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className={`${styles.link} ${isActive('/contact') ? styles.active : ''}`}
                      aria-current={isActive('/contact') ? 'page' : undefined}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
