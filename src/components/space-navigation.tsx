'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Para acrescentar ou mudar uma página da barra, edita esta lista.
const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/curso', label: 'Curso' },
  { href: '/team', label: 'Team' },
  { href: '/shelf', label: 'Shelf' },
  { href: '/shop', label: 'Shop' },
  { href: '/contactos', label: 'Contactos' },
];

/** Barra de navegação fixa no topo. No telemóvel os links passam para um painel que abre por baixo da barra. */
export default function SpaceNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // fecha o painel ao mudar de página
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: solid ? 'rgba(11, 12, 34, 0.85)' : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
        backdropFilter: solid ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(12px)' : 'none',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8" aria-label="Principal">
        <Link href="/" aria-label="NEETI – página inicial" className="flex items-center">
          <Image src="/logo.png" alt="NEETI" width={120} height={37} className="h-8 w-auto" priority />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className="relative rounded-md px-4 py-2 font-mono text-sm tracking-wider transition-colors hover:text-[var(--digital-cyan)]"
                  style={{ color: active ? 'var(--digital-cyan)' : 'var(--starlight)' }}
                >
                  {label}
                  <span
                    className="absolute inset-x-4 -bottom-0.5 h-px transition-opacity"
                    style={{ backgroundColor: 'var(--digital-cyan)', opacity: active ? 1 : 0 }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="nav-toggle p-2 md:hidden"
          style={{ color: 'var(--starlight)' }}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 px-4 pb-4 md:hidden">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="block rounded-lg px-4 py-3 font-mono tracking-wider"
                  style={{
                    color: active ? 'var(--digital-cyan)' : 'var(--starlight)',
                    backgroundColor: active ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
