import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  Camera,
  Mic,
  Users,
  Calendar,
  AlertCircle,
  Save,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

const symptomsList = [
  'Diarrhea', 'Vomiting', 'Fever', 'Abdominal pain',
  'Dehydration', 'Nausea', 'Fatigue', 'Loss of appetite',
];

const ageGroups = [
  'Under 5 years', '5–18 years', '19–60 years', 'Above 60 years',
];

const locations = [
  'Bhadra Village', 'Kumta Block', 'Sirsi Town', 'Yellapur',
  'Ankola', 'Karwar', 'Mundgod',
];

const severityOptions = [
  {
    value: 'mild',
    label: 'Mild',
    desc: 'Manageable, no hospitalisation needed',
    color: 'emerald',
    borderColor: 'border-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    desc: 'Concerning symptoms, monitoring required',
    color: 'amber',
    borderColor: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  {
    value: 'severe',
    label: 'Severe',
    desc: 'Critical — immediate medical attention needed',
    color: 'red',
    borderColor: 'border-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-400',
  },
];

const CaseReporting: React.FC = () => {
  const { isOnline, addToSyncQueue } = useOffline();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    symptoms: [] as string[],
    patientCount: 1,
    ageGroup: '',
    severity: 'mild',
    description: '',
  });

  const toggleSymptom = (s: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter(x => x !== s)
        : [...prev.symptoms, s],
    }));
  };

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    const report = {
      ...formData,
      id: Date.now().toString(),
      type: 'case_report',
      status: isDraft ? 'draft' : 'submitted',
      timestamp: new Date().toISOString(),
    };
    if (!isDraft) {
      if (isOnline) {
        console.log('Submitting report:', report);
      } else {
        addToSyncQueue(report);
      }
      setSubmitted(true);
    } else {
      addToSyncQueue(report);
      alert('Draft saved to sync queue.');
    }
  };

  const reset = () => {
    setSubmitted(false);
    setFormData({
      location: '',
      date: new Date().toISOString().split('T')[0],
      symptoms: [],
      patientCount: 1,
      ageGroup: '',
      severity: 'mild',
      description: '',
    });
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Report submitted</h2>
        <p className="text-gray-500 text-sm">
          {isOnline
            ? 'Your case report has been submitted successfully.'
            : 'Saved offline — will sync automatically when you reconnect.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Case Reporting</h1>
          <p className="text-sm text-gray-500">Report waterborne disease cases in your community</p>
        </div>
      </div>

      <form onSubmit={e => handleSubmit(e, false)} className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Basic information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <MapPin className="inline h-3.5 w-3.5 mr-1 text-gray-400" />Location *
              </label>
              <select
                required
                value={formData.location}
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select location</option>
                {locations.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <Calendar className="inline h-3.5 w-3.5 mr-1 text-gray-400" />Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <Users className="inline h-3.5 w-3.5 mr-1 text-gray-400" />Number of patients *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.patientCount}
                onChange={e => setFormData(p => ({ ...p, patientCount: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Primary age group *
              </label>
              <select
                required
                value={formData.ageGroup}
                onChange={e => setFormData(p => ({ ...p, ageGroup: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select age group</option>
                {ageGroups.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Symptoms observed *</h2>
            {formData.symptoms.length > 0 && (
              <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                {formData.symptoms.length} selected
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {symptomsList.map(s => {
              const checked = formData.symptoms.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all text-left ${
                    checked
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {formData.symptoms.length === 0 && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Please select at least one symptom
            </p>
          )}
        </div>

        {/* Severity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Severity assessment *</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {severityOptions.map(opt => {
              const active = formData.severity === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, severity: opt.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    active ? `${opt.borderColor} ${opt.bg}` : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                    <span className={`text-sm font-semibold ${active ? opt.text : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description + attachments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Additional details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Description &amp; notes
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Suspected causes, additional context, observations…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Attachments (optional)</p>
              <div className="flex gap-2">
                <button type="button" className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4" /> Photo
                </button>
                <button type="button" className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Mic className="h-4 w-4" /> Voice note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={e => handleSubmit(e, true)}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Save className="h-4 w-4" /> Save draft
          </button>
          <button
            type="submit"
            disabled={formData.symptoms.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {isOnline ? 'Submit report' : 'Queue for sync'}
          </button>
        </div>

        {!isOnline && (
          <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-4 py-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            You're offline. The report will be submitted automatically when you reconnect.
          </div>
        )}
      </form>
    </div>
  );
};

export default CaseReporting;
