import { useState } from 'react';
import { Database, Folder, ChevronRight, ChevronDown, AlertTriangle, ShieldCheck, Copy, Check } from 'lucide-react';

export interface RegistryItem {
  hive: string;
  key: string;
  valueName: string;
  valueData: string;
  valueType?: string;
  lastModified?: string;
  suspicious?: boolean;
}

interface RegistryViewerProps {
  keys: RegistryItem[];
}

export default function RegistryViewer({ keys }: RegistryViewerProps) {
  const [selectedHive, setSelectedHive] = useState<string>('ALL');
  const [selectedKeyPath, setSelectedKeyPath] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hives = ['ALL', ...Array.from(new Set(keys.map((k) => k.hive)))];
  const uniquePaths = ['ALL', ...Array.from(new Set(keys.map((k) => k.key)))];

  const filteredKeys = keys.filter((item) => {
    if (selectedHive !== 'ALL' && item.hive !== selectedHive) return false;
    if (selectedKeyPath !== 'ALL' && item.key !== selectedKeyPath) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      item.hive.toLowerCase().includes(term) ||
      item.key.toLowerCase().includes(term) ||
      item.valueName.toLowerCase().includes(term) ||
      item.valueData.toLowerCase().includes(term)
    );
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden font-sans">
      {/* Header Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono flex items-center gap-2">
              <span>Éditeur du Registre Windows (regedit.exe)</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">Ruche Mémorisée</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">Autopsie des clés d'exécution & persistance</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer clé, valeur ou binaire..."
            className="pl-3 pr-3 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Main split: Tree / Filter Left, Table Right */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Hives & Keys list */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-3 overflow-y-auto space-y-3 font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">Ruches (Hives) :</span>
            <div className="space-y-1">
              {hives.map((hive) => (
                <button
                  key={hive}
                  onClick={() => {
                    setSelectedHive(hive);
                    setSelectedKeyPath('ALL');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors cursor-pointer ${
                    selectedHive === hive
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">{hive}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5">Chemins Détectés :</span>
            <div className="space-y-1">
              {uniquePaths.map((path) => (
                <button
                  key={path}
                  onClick={() => setSelectedKeyPath(path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] ${
                    selectedKeyPath === path
                      ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={path}
                >
                  {selectedKeyPath === path ? (
                    <ChevronDown className="w-3 h-3 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                  )}
                  <span className="truncate">{path === 'ALL' ? 'Toutes les clés' : path.split('\\').pop()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Values Table */}
        <div className="flex-1 overflow-auto bg-slate-900/60 flex flex-col">
          <table className="w-full text-left text-xs font-mono text-slate-300 border-collapse">
            <thead className="bg-slate-950 sticky top-0 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] z-10">
              <tr>
                <th className="py-2.5 px-3">Nom de Valeur</th>
                <th className="py-2.5 px-2">Type</th>
                <th className="py-2.5 px-3">Données (Chemin / Commande)</th>
                <th className="py-2.5 px-2 text-right">Évaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKeys.map((item, idx) => {
                const isSuspicious = item.suspicious || item.valueData.toLowerCase().includes('\\temp\\') || item.valueData.toLowerCase().includes('powershell');
                const rowId = `reg-${idx}`;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-cyan-500/5 ${
                      isSuspicious ? 'bg-rose-500/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span>{item.valueName || '(Par défaut)'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-xs">
                        {item.hive}\\{item.key}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-indigo-300 text-[11px]">
                      {item.valueType || 'REG_SZ'}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      <div className="flex items-center justify-between gap-2 max-w-md">
                        <span className="truncate text-cyan-300">{item.valueData}</span>
                        <button
                          onClick={() => copyToClipboard(item.valueData, rowId)}
                          className="text-slate-500 hover:text-cyan-400 p-1 shrink-0"
                          title="Copier la valeur"
                        >
                          {copiedKey === rowId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      {isSuspicious ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" /> SUSPECT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700/50">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> LÉGITIME
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredKeys.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              Aucune clé de registre ne correspond aux critères sélectionnés.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
