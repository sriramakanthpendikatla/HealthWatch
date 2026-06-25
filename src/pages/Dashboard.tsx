import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  Droplets,
  Users,
  MapPin,
  Calendar,
  Activity,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/* ── tiny inline sparkline ── */
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ── donut chart ── */
const Donut: React.FC<{ value: number; total: number; color: string }> = ({ value, total, color }) => {
  const r = 20, cx = 26, cy = 26;
  const circ = 2 * Math.PI * r;
  const pct = value / total;
  const dash = pct * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="6" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
};

/* ── bar chart ── */
const BarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-3 h-24">
      {data.map(d => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-gray-700">{d.value}</span>
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.value / max) * 64}px`, backgroundColor: d.color }} />
          <span className="text-xs text-gray-400 text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d'>('7d');

  const stats = [
    {
      name: 'Active Cases',
      value: 23,
      change: '+12%',
      up: true,
      icon: TrendingUp,
      color: '#EF4444',
      bg: 'bg-red-50',
      sparkData: [8, 12, 10, 15, 18, 20, 23],
    },
    {
      name: 'Water Sources',
      value: 156,
      change: '+3%',
      up: true,
      icon: Droplets,
      color: '#3B82F6',
      bg: 'bg-blue-50',
      sparkData: [140, 143, 148, 150, 151, 154, 156],
    },
    {
      name: 'Communities',
      value: 42,
      change: '0%',
      up: null,
      icon: Users,
      color: '#10B981',
      bg: 'bg-emerald-50',
      sparkData: [42, 42, 42, 42, 42, 42, 42],
    },
    {
      name: 'Alerts This Week',
      value: 7,
      change: '-15%',
      up: false,
      icon: AlertTriangle,
      color: '#F59E0B',
      bg: 'bg-amber-50',
      sparkData: [12, 10, 9, 11, 8, 9, 7],
    },
  ];

  const weeklyData = {
    '7d': [
      { label: 'Mon', value: 4, color: '#BFDBFE' },
      { label: 'Tue', value: 6, color: '#BFDBFE' },
      { label: 'Wed', value: 3, color: '#BFDBFE' },
      { label: 'Thu', value: 8, color: '#BFDBFE' },
      { label: 'Fri', value: 5, color: '#93C5FD' },
      { label: 'Sat', value: 9, color: '#3B82F6' },
      { label: 'Sun', value: 7, color: '#93C5FD' },
    ],
    '30d': [
      { label: 'W1', value: 18, color: '#BFDBFE' },
      { label: 'W2', value: 24, color: '#93C5FD' },
      { label: 'W3', value: 31, color: '#3B82F6' },
      { label: 'W4', value: 23, color: '#93C5FD' },
    ],
  };

  const waterStatusData = [
    { label: 'Safe', value: 102, color: '#10B981' },
    { label: 'Caution', value: 38, color: '#F59E0B' },
    { label: 'Unsafe', value: 16, color: '#EF4444' },
  ];

  const recentAlerts = [
    { id: 1, type: 'High Risk', location: 'Bhadra Village', time: '2h ago', severity: 'high' },
    { id: 2, type: 'Water Quality', location: 'Kumta Block', time: '4h ago', severity: 'medium' },
    { id: 3, type: 'Case Cluster', location: 'Sirsi Town', time: '6h ago', severity: 'high' },
  ];

  const recentCases = [
    { id: 1, symptoms: 'Diarrhea, Fever', location: 'Bhadra Village', reporter: 'Sunita Devi', time: '1h ago' },
    { id: 2, symptoms: 'Vomiting, Abdominal pain', location: 'Kumta Block', reporter: 'Rajesh Kumar', time: '3h ago' },
    { id: 3, symptoms: 'Diarrhea, Dehydration', location: 'Sirsi Town', reporter: 'Priya Sharma', time: '5h ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/case-reporting')}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Report Case
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <Sparkline data={stat.sparkData} color={stat.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.name}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                stat.up === null ? 'text-gray-400'
                  : stat.up ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {stat.up === null ? null : stat.up
                  ? <ArrowUpRight className="h-3 w-3" />
                  : <ArrowDownRight className="h-3 w-3" />
                }
                {stat.change} vs last week
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Case trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">New Cases</h2>
              <p className="text-xs text-gray-400">Reported cases over time</p>
            </div>
            <div className="flex gap-1">
              {(['7d', '30d'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedPeriod === p
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={weeklyData[selectedPeriod]} />
        </div>

        {/* Water status donut */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Water Source Status</h2>
          <p className="text-xs text-gray-400 mb-4">156 sources monitored</p>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg width="100" height="100" viewBox="0 0 100 100">
                {/* bg ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {/* safe: 102/156 = 65% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12"
                  strokeDasharray={`${0.655 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                  strokeLinecap="butt" transform="rotate(-90 50 50)" />
                {/* caution: 38/156 = 24% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="12"
                  strokeDasharray={`${0.244 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                  strokeLinecap="butt" transform={`rotate(${-90 + 0.655 * 360} 50 50)`} />
                {/* unsafe: 16/156 = 10% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="12"
                  strokeDasharray={`${0.103 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                  strokeLinecap="butt" transform={`rotate(${-90 + (0.655 + 0.244) * 360} 50 50)`} />
                <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1F2937">156</text>
                <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#9CA3AF">sources</text>
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            {waterStatusData.map(d => (
              <div key={d.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.label}</span>
                </div>
                <span className="font-semibold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Alerts</h2>
            <span className="text-xs bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">
              {recentAlerts.filter(a => a.severity === 'high').length} high
            </span>
          </div>
          <div className="space-y-2.5">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{alert.location}
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Cases</h2>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="space-y-2.5">
            {recentCases.map(c => (
              <div key={c.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{c.symptoms}</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{c.location} · by {c.reporter}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{c.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Report Case', icon: Activity, color: 'blue', to: '/case-reporting' },
          { label: 'Test Water', icon: Droplets, color: 'teal', to: '/water-quality' },
          { label: 'Send Alert', icon: AlertTriangle, color: 'orange', to: '/dashboard' },
          { label: 'Mark Resolved', icon: CheckCircle, color: 'green', to: '/dashboard' },
        ].map(({ label, icon: Icon, color, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className={`flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-${color}-200 hover:bg-${color}-50 transition-colors shadow-sm`}
          >
            <div className={`w-9 h-9 rounded-lg bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-4 w-4 text-${color}-600`} />
            </div>
            <span className="text-sm font-medium text-gray-900">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
