import React, { useState } from 'react';
import { User, Phone, Globe, MapPin, Shield, Save, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  district_officer: 'District Officer',
  clinic: 'Clinic Staff',
  asha: 'ASHA Worker',
  volunteer: 'Volunteer',
};

const languages = [
  { value: 'en', label: 'English' },
  { value: 'kn', label: 'Kannada' },
  { value: 'hi', label: 'Hindi' },
  { value: 'mr', label: 'Marathi' },
];

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    language: user?.language ?? 'en',
    village_id: user?.village_id ?? '',
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <User className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500">Manage your account information</p>
        </div>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 text-xl font-bold flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{roleLabels[user.role] ?? user.role}</p>
          {user.verified && (
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified account
            </span>
          )}
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Personal information</h3>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="text-xs text-blue-600 font-medium hover:underline">
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Full name</p>
              {editing ? (
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              )}
            </div>
          </div>

          {/* Phone (read-only) */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Phone className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Mobile number</p>
              <p className="text-sm font-medium text-gray-900">{user.phone}</p>
            </div>
          </div>

          {/* Role (read-only) */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Role</p>
              <p className="text-sm font-medium text-gray-900">{roleLabels[user.role] ?? user.role}</p>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Globe className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Preferred language</p>
              {editing ? (
                <select
                  value={form.language}
                  onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  {languages.find(l => l.value === user.language)?.label ?? user.language}
                </p>
              )}
            </div>
          </div>

          {/* Village */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Village / area</p>
              {editing ? (
                <input
                  value={form.village_id}
                  onChange={e => setForm(p => ({ ...p, village_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. village_1"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900">{user.village_id ?? '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save / cancel */}
        {editing && (
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            <button onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 mt-4 text-xs text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-lg">
            <CheckCircle2 className="h-4 w-4" /> Profile updated successfully
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Account actions</h3>
        <button onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
};

export default Profile;
