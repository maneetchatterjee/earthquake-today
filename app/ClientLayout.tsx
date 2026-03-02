'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sidebar-collapsed');
      if (stored !== null) setCollapsed(stored === 'true');
    } catch (e) {
      console.warn('Could not read sidebar state from localStorage:', e);
    }
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('sidebar-collapsed', String(next));
    } catch (e) {
      console.warn('Could not save sidebar state to localStorage:', e);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus-visible:ring-2"
      >
        Skip to content
      </a>

      {/* Hamburger for mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 text-white"
      >
        ☰
      </button>

      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        id="main-content"
        className={`flex-1 transition-all duration-300 min-h-screen ${
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
