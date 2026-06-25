import React, { useState } from 'react';
import { Lightbulb, Droplets, ShieldCheck, HeartPulse, Home, Search } from 'lucide-react';

type Category = 'all' | 'water' | 'hygiene' | 'prevention' | 'home';

const tips = [
  {
    id: 1, category: 'water' as Category,
    title: 'Boil drinking water',
    body: 'Always boil water for at least 1 minute before drinking if you\'re unsure about its safety. Let it cool and store in a covered container.',
    icon: Droplets,
    color: 'blue',
  },
  {
    id: 2, category: 'hygiene' as Category,
    title: 'Wash hands frequently',
    body: 'Use soap and clean water for at least 20 seconds — especially before eating, after using the toilet, and after handling animals or waste.',
    icon: ShieldCheck,
    color: 'emerald',
  },
  {
    id: 3, category: 'prevention' as Category,
    title: 'Recognise early symptoms',
    body: 'Diarrhea, vomiting, stomach cramps, and fever within 24–72 hours of drinking water may indicate a waterborne illness. Seek medical help promptly.',
    icon: HeartPulse,
    color: 'red',
  },
  {
    id: 4, category: 'home' as Category,
    title: 'Store water safely',
    body: 'Use narrow-mouth containers with tight lids. Don\'t dip hands into stored water — use a clean ladle. Clean containers weekly with diluted bleach.',
    icon: Home,
    color: 'amber',
  },
  {
    id: 5, category: 'water' as Category,
    title: 'Use chlorine for disinfection',
    body: 'Add 2 drops of liquid bleach (5% chlorine) per litre of water, stir and leave for 30 minutes before drinking. A slight chlorine smell means it\'s safe.',
    icon: Droplets,
    color: 'blue',
  },
  {
    id: 6, category: 'prevention' as Category,
    title: 'ORS for dehydration',
    body: 'Oral Rehydration Salts (ORS) replace lost fluids and electrolytes. Mix one sachet in 1 litre of clean water. Give small sips frequently.',
    icon: HeartPulse,
    color: 'red',
  },
  {
    id: 7, category: 'hygiene' as Category,
    title: 'Keep wells covered',
    body: 'Always cover wells with a tight lid to prevent contamination from animals, insects, and debris. Disinfect the well after flooding events.',
    icon: ShieldCheck,
    color: 'emerald',
  },
  {
    id: 8, category: 'home' as Category,
    title: 'Avoid open defecation',
    body: 'Human waste is a primary source of waterborne pathogens. Use latrines and dispose of waste at least 30 metres away from water sources.',
    icon: Home,
    color: 'amber',
  },
];

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All tips' },
  { id: 'water', label: 'Water safety' },
  { id: 'hygiene', label: 'Hygiene' },
  { id: 'prevention', label: 'Prevention' },
  { id: 'home', label: 'Home care' },
];

const colorMap: Record<string, { bg: string; text: string; iconBg: string; iconText: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    iconBg: 'bg-blue-100',    iconText: 'text-blue-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  red:     { bg: 'bg-red-50',     text: 'text-red-700',     iconBg: 'bg-red-100',     iconText: 'text-red-600' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   iconBg: 'bg-amber-100',   iconText: 'text-amber-600' },
};

const Tips: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');

  const filtered = tips.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.body.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Health Tips</h1>
          <p className="text-sm text-gray-500">Prevention and treatment guidance for waterborne diseases</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tips…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === c.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tips grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No tips found for "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(tip => {
            const Icon = tip.icon;
            const cls = colorMap[tip.color];
            return (
              <div key={tip.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cls.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${cls.iconText}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-gray-900">{tip.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls.bg} ${cls.text} capitalize`}>
                        {tip.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tips;
