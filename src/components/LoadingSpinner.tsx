import React from 'react';
import { Activity } from 'lucide-react';

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
      <Activity className="h-6 w-6 text-white" />
    </div>
    <p className="text-sm text-gray-500">Loading HealthWatch…</p>
  </div>
);

export default LoadingSpinner;
