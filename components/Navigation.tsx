'use client';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: '🌍 Overview' },
  { id: 'earthquakes', label: '🌋 Earthquakes' },
  { id: 'weather', label: '🌡️ Weather' },
  { id: 'airquality', label: '💨 Air Quality' },
  { id: 'wildfires', label: '🔥 Wildfires' },
  { id: 'oceans', label: '🌊 Oceans & Tides' },
  { id: 'environment', label: '🌍 Environment' },
  { id: 'news', label: '📰 News' },
];

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="bg-gray-900/95 border-b border-gray-700 sticky top-[64px] z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
