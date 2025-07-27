import React from 'react';

export default function Sidebar({ panels, selectedPanel, setSelectedPanel }) {
  return (
    <aside className="w-64 bg-white/95 rounded-3xl shadow-2xl p-6 border border-white/30 flex flex-col min-h-[500px]">
      {/* Dashboard Title */}
      <div className="mb-8 flex items-center gap-2">
        <span className="font-extrabold text-2xl tracking-tight text-black">Dashboard</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {panels.map(({ key, label, icon: Icon }, idx) => (
          <div key={key} className="relative">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-all duration-200 group
                ${selectedPanel === key
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-black shadow-lg scale-[1.03] border-l-4 border-green-700'
                  : 'text-black border-l-4 bg-transparent border-transparent'}
              `}
              style={{marginTop: idx === 0 ? 0 : 6}}
              onClick={() => setSelectedPanel(key)}
            >
              <Icon className="w-5 h-5 text-black opacity-80" />
              <span className="text-black text-base font-semibold tracking-wide">{label}</span>
            </button>
          </div>
        ))}
      </nav>
      {/* Footer or version info can go here if needed */}
    </aside>
  );
}