import { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle, Search, Filter, Calendar, FileText, Globe, Cpu } from 'lucide-react';

export interface TimelineEventItem {
  id: string;
  timestamp: string;
  source: string;
  category: string;
  description: string;
  details?: Record<string, string>;
  isMalicious?: boolean;
}

interface TimelineVisualizerProps {
  events: TimelineEventItem[];
}

export default function TimelineVisualizer({ events }: TimelineVisualizerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [onlyMalicious, setOnlyMalicious] = useState(false);

  const sources = ['ALL', ...Array.from(new Set(events.map((e) => e.source)))];

  const filteredEvents = events.filter((evt) => {
    if (selectedSource !== 'ALL' && evt.source !== selectedSource) return false;
    if (onlyMalicious && !evt.isMalicious) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();

    return (
      evt.id.toLowerCase().includes(term) ||
      evt.source.toLowerCase().includes(term) ||
      evt.category.toLowerCase().includes(term) ||
      evt.description.toLowerCase().includes(term) ||
      evt.timestamp.toLowerCase().includes(term)
    );
  });

  const getSourceIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('web')) return <Globe className="w-3.5 h-3.5 text-blue-400" />;
    if (s.includes('sysmon') || s.includes('process')) return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
    return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono flex items-center gap-2">
              <span>Super-Timeline Forensique (Plaso / Log2Timeline)</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">Chronologie Certifiée</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">Reconstitution seconde par seconde du scénario d'intrusion</p>
          </div>
        </div>

        {/* Search & Only Malicious Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher événement..."
              className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={() => setOnlyMalicious(!onlyMalicious)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
              onlyMalicious
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Malveillants</span>
          </button>
        </div>
      </div>

      {/* Source Filters Bar */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        <span className="text-slate-500 flex items-center gap-1 text-[11px] mr-1">
          <Filter className="w-3 h-3" /> Sources :
        </span>
        {sources.map((src) => (
          <button
            key={src}
            onClick={() => setSelectedSource(src)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer capitalize ${
              selectedSource === src
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {src === 'ALL' ? 'Toutes' : src}
          </button>
        ))}
      </div>

      {/* Events Stream List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
        {filteredEvents.map((evt, idx) => {
          const isSus = evt.isMalicious;

          return (
            <div
              key={evt.id || idx}
              className={`relative flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                isSus
                  ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isSus ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                {idx < filteredEvents.length - 1 && (
                  <div className="w-[1px] h-8 bg-slate-800 my-1"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {evt.timestamp}
                    </span>

                    <span className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                      {getSourceIcon(evt.source)}
                      <span>{evt.source}</span>
                    </span>

                    <span className="px-1.5 py-0.2 rounded bg-slate-800/50 text-[10px] text-slate-400">
                      {evt.category}
                    </span>
                  </div>

                  {isSus ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> ACTION MALVEILLANTE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> TRAÇAGE NORMAL
                    </span>
                  )}
                </div>

                <p className={`text-xs leading-relaxed font-sans ${
                  isSus ? 'text-rose-200 font-medium' : 'text-slate-200'
                }`}>
                  {evt.description}
                </p>

                {evt.details && Object.keys(evt.details).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono">
                    {Object.entries(evt.details).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-slate-500">{k}:</span> <span className="text-slate-300">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            Aucun événement ne correspond à vos filtres.
          </div>
        )}
      </div>
    </div>
  );
}
