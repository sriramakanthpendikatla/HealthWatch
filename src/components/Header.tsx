import React from 'react';
import { Menu, Bell, Activity, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isOnline, syncQueue } = useOffline();

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() ?? '?';

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-sm hidden sm:block">HealthWatch</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Connectivity badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isOnline
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-orange-50 text-orange-700'
        }`}>
          {isOnline
            ? <><Wifi className="h-3 w-3" /> Online</>
            : <><WifiOff className="h-3 w-3" /> Offline</>
          }
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="h-4 w-4" />
          {syncQueue.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Header;
