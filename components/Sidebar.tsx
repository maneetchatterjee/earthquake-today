'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { icon: '🌍', label: 'Overview', href: '/' },
  { icon: '🌋', label: 'Earthquakes', href: '/earthquakes' },
  { icon: '🌡️', label: 'Weather', href: '/weather' },
  { icon: '💨', label: 'Air Quality', href: '/air-quality' },
  { icon: '🔥', label: 'Wildfires', href: '/wildfires' },
  { icon: '🌊', label: 'Oceans & Tides', href: '/oceans' },
  { icon: '🌌', label: 'Space', href: '/space' },
  { icon: '⚡', label: 'Energy & Emissions', href: '/energy' },
  { icon: '🧲', label: 'Atmosphere & Science', href: '/atmosphere' },
  { icon: '🛩️', label: 'Human Activity', href: '/human' },
  { icon: '📰', label: 'News', href: '/news' },
  { icon: '📍', label: 'My Location', href: '/my-location' },
  { icon: '🏆', label: 'Records & Score', href: '/records' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300
          backdrop-blur-xl bg-[#0A0E1A]/90 border-r border-white/10
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-white/10`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xl">🌍</span>
              <span className="font-bold text-white text-sm">Earth Monitor</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
          >
            {collapsed ? '›' : '‹'}
          </button>
          {!collapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live indicator */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
            <span className="text-xs font-bold text-red-400 tracking-widest">LIVE</span>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all duration-200 text-sm
                  ${isActive
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.2)] border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }
                  ${collapsed ? 'justify-center px-2' : ''}
                `}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3">
          {!collapsed && (
            <div className="text-xs text-slate-500 text-center">
              Earth Monitor v2.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
