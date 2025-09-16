'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linksLeft = [
    { href: '/catalog', label: 'Catalog' },
    { href: '/servicing', label: 'Servicing' },
  ];

  const linksRight = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // esc to close + lock scroll
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = open ? 'hidden' : (prev || '');

    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev || '';
    };
  }, [open]);

  // click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <header className={`${styles.header} ${styles.atTop}`}>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <div className={styles.topRail} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.brandWrap}>
          <nav className={styles.centerNav} aria-label="Primary">
            <div className={styles.dock}>
              <div className={styles.dockContent}>
                {/* Left (desktop) */}
                <ul className={`${styles.centerList} ${styles.centerLeft} ${styles.hideOnMobile}`}>
                  {linksLeft.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`${styles.link} ${isActive(link.href) ? styles.active : ''}`}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Logo (desktop center) */}
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

                {/* Right (desktop) */}
                <ul className={`${styles.centerList} ${styles.centerRight} ${styles.hideOnMobile}`}>
                  {linksRight.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`${styles.link} ${isActive(link.href) ? styles.active : ''}`}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Burger (mobile only) */}
                <div className={styles.mobileControls}>
                  <button
                    type="button"
                    className={styles.burger}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen(v => !v)}
                  >
                    <span className={styles.burgerBox} aria-hidden="true">
                      <span className={styles.burgerInner} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`${styles.mobilePanel} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className={styles.mobilePanelInner}>
          {/* mobile logo */}
          <div className={styles.mobileLogoWrap}>
            <Link
              href="/"
              className={styles.mobileLogoLink}
              aria-label="Go to Anything Electronic home"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              <Image
                src="/icons/logo.svg"
                alt="Anything Electronic logo"
                width={200}
                height={70}
                priority
                className={styles.mobileLogoImg}
              />
            </Link>
          </div>

          <ul className={styles.mobileList}>
            {[...linksLeft, ...linksRight].map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.mobileLink} ${isActive(link.href) ? styles.mobileActive : ''}`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
