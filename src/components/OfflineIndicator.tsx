import React from 'react';
import { WifiOff, Clock } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

const OfflineIndicator: React.FC = () => {
  const { isOnline, syncQueue } = useOffline();

  if (isOnline && syncQueue.length === 0) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium ${
      !isOnline
        ? 'bg-orange-600 text-white'
        : 'bg-blue-600 text-white'
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4" />
          You're offline — reports will sync when connected
        </>
      ) : (
        <>
          <Clock className="h-4 w-4 animate-spin" />
          Syncing {syncQueue.length} pending {syncQueue.length === 1 ? 'report' : 'reports'}…
        </>
      )}
    </div>
  );
};

export default OfflineIndicator;
