import React, { useState } from 'react';
import {
  Droplets,
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  TrendingUp,
  FlaskConical,
  Wifi,
  WifiOff,
  Plus
} from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

type Tab = 'test' | 'results' | 'sensors';
type Status = 'safe' | 'caution' | 'unsafe';

const waterSources = [
  'Village Well #1', 'Village Well #2', 'Hand Pump A',
  'Hand Pump B', 'Community Tank', 'Borewell Main', 'River Intake',
];

const statusConfig: Record<Status, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  safe:    { label: 'Safe',    icon: CheckCircle,   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  caution: { label: 'Caution', icon: AlertTriangle, bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  unsafe:  { label: 'Unsafe',  icon: XCircle,       bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
};

const recentTests = [
  { id: 1, source: 'Village Well #1', date: '2024-01-15', ph: 6.8, turbidity: 4.2, temperature: 24, status: 'safe'    as Status, tester: 'Sunita Devi' },
  { id: 2, source: 'Hand Pump A',     date: '2024-01-15', ph: 5.9, turbidity: 8.5, temperature: 26, status: 'caution' as Status, tester: 'Rajesh Kumar' },
  { id: 3, source: 'Community Tank',  date: '2024-01-14', ph: 5.2, turbidity: 12.1,temperature: 28, status: 'unsafe'  as Status, tester: 'Priya Sharma' },
];

const sensors = [
  { id: 1, name: 'Sensor WQ-001', location: 'Village Well #1', status: 'active',  lastReading: '2024-01-15 14:30', ph: 6.8, turbidity: 3.2, temperature: 24 },
  { id: 2, name: 'Sensor WQ-002', location: 'Hand Pump A',     status: 'offline', lastReading: '2024-01-14 09:15', ph: 6.2, turbidity: 5.1, temperature: 25 },
];

/* ── mini param badge ── */
const ParamBadge: React.FC<{ label: string; value: string; ok: boolean }> = ({ label, value, ok }) => (
  <div className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs ${ok ? 'bg-emerald-50' : 'bg-red-50'}`}>
    <span className={`font-semibold ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{value}</span>
    <span className={ok ? 'text-emerald-500' : 'text-red-500'}>{label}</span>
  </div>
);

const WaterQuality: React.FC = () => {
  const { isOnline, addToSyncQueue } = useOffline();
  const [activeTab, setActiveTab] = useState<Tab>('test');
  const [submitted, setSubmitted] = useState(false);

  const [testData, setTestData] = useState({
    source: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    testType: 'manual',
    ph: '',
    turbidity: '',
    temperature: '',
    ecoli: '',
    chlorine: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const report = { ...testData, id: Date.now().toString(), type: 'water_quality', timestamp: new Date().toISOString() };
    if (isOnline) { console.log('Submitting:', report); }
    else { addToSyncQueue(report); }
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setTestData({ source: '', date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0, 5), testType: 'manual', ph: '', turbidity: '', temperature: '', ecoli: '', chlorine: '', notes: '' });
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'test',    label: 'New test',     icon: FlaskConical },
    { id: 'results', label: 'Test results', icon: TrendingUp },
    { id: 'sensors', label: 'Sensors',      icon: Activity },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <Droplets className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Water Quality Monitoring</h1>
          <p className="text-sm text-gray-500">Test water sources and track quality parameters</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSubmitted(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === id
                  ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── New test ── */}
          {activeTab === 'test' && (
            submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Test results saved</h3>
                <p className="text-sm text-gray-500">{isOnline ? 'Submitted successfully.' : 'Saved offline — will sync when connected.'}</p>
                <button onClick={resetForm} className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  Record another test
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Location / date / time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      <MapPin className="inline h-3.5 w-3.5 mr-1 text-gray-400" />Water source *
                    </label>
                    <select required value={testData.source} onChange={e => setTestData(p => ({ ...p, source: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="">Select source</option>
                      {waterSources.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      <Calendar className="inline h-3.5 w-3.5 mr-1 text-gray-400" />Date *
                    </label>
                    <input type="date" required value={testData.date} onChange={e => setTestData(p => ({ ...p, date: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Time *</label>
                    <input type="time" required value={testData.time} onChange={e => setTestData(p => ({ ...p, time: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>

                {/* Test type */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Test method</p>
                  <div className="flex gap-4">
                    {[{ value: 'manual', label: 'Manual test kit' }, { value: 'sensor', label: 'Sensor reading' }].map(t => (
                      <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="testType" value={t.value}
                          checked={testData.testType === t.value}
                          onChange={e => setTestData(p => ({ ...p, testType: e.target.value }))}
                          className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500" />
                        <span className="text-sm text-gray-700">{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'ph', label: 'pH level', placeholder: '6.5 – 8.5', hint: 'Safe: 6.5 – 8.5', step: '0.1', min: '0', max: '14' },
                    { key: 'turbidity', label: 'Turbidity (NTU)', placeholder: '< 5 NTU', hint: 'Safe: < 5 NTU', step: '0.1', min: '0', max: '' },
                    { key: 'temperature', label: 'Temperature (°C)', placeholder: '20 – 30 °C', hint: '', step: '0.1', min: '0', max: '' },
                    { key: 'ecoli', label: 'E. coli (CFU/100 ml)', placeholder: '0', hint: 'Safe: 0', step: '1', min: '0', max: '' },
                    { key: 'chlorine', label: 'Chlorine (mg/L)', placeholder: '0.2 – 0.5', hint: 'Safe: 0.2 – 0.5 mg/L', step: '0.01', min: '0', max: '' },
                  ].map(({ key, label, placeholder, hint, step, min, max }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        {key === 'temperature' && <Thermometer className="inline h-3.5 w-3.5 mr-1 text-gray-400" />}
                        {label}{['ph', 'turbidity'].includes(key) ? ' *' : ''}
                      </label>
                      <input
                        type="number"
                        step={step}
                        min={min}
                        max={max || undefined}
                        required={['ph', 'turbidity'].includes(key)}
                        value={(testData as any)[key]}
                        onChange={e => setTestData(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes &amp; observations</label>
                  <textarea rows={3} value={testData.notes}
                    onChange={e => setTestData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Unusual observations, test conditions, or additional notes…"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                </div>

                <button type="submit"
                  className="w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  {isOnline ? 'Submit test results' : 'Queue for sync'}
                </button>
              </form>
            )
          )}

          {/* ── Results ── */}
          {activeTab === 'results' && (
            <div className="space-y-3">
              {recentTests.map(test => {
                const cfg = statusConfig[test.status];
                const StatusIcon = cfg.icon;
                const phOk = test.ph >= 6.5 && test.ph <= 8.5;
                const turbOk = test.turbidity <= 5;
                return (
                  <div key={test.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{test.source}</p>
                        <p className="text-xs text-gray-500">Tested by {test.tester} · {test.date}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <ParamBadge label="pH" value={`${test.ph}`} ok={phOk} />
                      <ParamBadge label="Turbidity" value={`${test.turbidity} NTU`} ok={turbOk} />
                      <ParamBadge label="Temp" value={`${test.temperature} °C`} ok={true} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Sensors ── */}
          {activeTab === 'sensors' && (
            <div className="space-y-3">
              {sensors.map(s => (
                <div key={s.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{s.location}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      s.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {s.status === 'active'
                        ? <><Wifi className="h-3.5 w-3.5" /> Active</>
                        : <><WifiOff className="h-3.5 w-3.5" /> Offline</>
                      }
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <ParamBadge label="pH" value={`${s.ph}`} ok={s.ph >= 6.5 && s.ph <= 8.5} />
                    <ParamBadge label="Turbidity" value={`${s.turbidity} NTU`} ok={s.turbidity <= 5} />
                    <ParamBadge label="Temp" value={`${s.temperature} °C`} ok={true} />
                  </div>
                  <p className="text-xs text-gray-400">Last reading: {s.lastReading}</p>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-teal-300 hover:text-teal-600 transition-colors">
                <Plus className="h-4 w-4" /> Add new sensor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterQuality;
