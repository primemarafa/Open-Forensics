import { useState } from 'react';
import { BookOpen, X, Cpu, HardDrive, ShieldCheck, CheckSquare, Layers } from 'lucide-react';

interface DFIRPlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DFIRPlaybookModal({ isOpen, onClose }: DFIRPlaybookModalProps) {
  const [activeTab, setActiveTab] = useState<'volatility' | 'disk' | 'memory' | 'custody'>('volatility');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Playbook & Méthodologie DFIR</h3>
              <p className="text-xs text-slate-400">Guides d'investigation numérique, Volatility 3 et artéfacts Windows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto text-xs font-mono">
          {[
            { id: 'volatility', label: '1. Ordre de Volatilité (RFC 3227)' },
            { id: 'memory', label: '2. Aide-Mémoire Volatility 3' },
            { id: 'disk', label: '3. Artéfacts Disque & Persistance' },
            { id: 'custody', label: '4. Chaîne de Traçabilité' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'volatility' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <h4 className="font-bold text-cyan-400 flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4" /> Ordre de Volatilité des Preuves Numériques (RFC 3227)
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  L'ordre chronologique strict selon lequel un analyste doit acquérir les données pour éviter toute altération irrémédiable :
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-rose-400">1. Registres du processeur & Cache CPU</span>
                  <span className="text-slate-500">Durée de vie : Nanosecondes</span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-amber-400">2. Mémoire Vive (RAM) & Tables de routage/ARP</span>
                  <span className="text-slate-500">Durée de vie : Millisecondes / Perdu à l'extinction</span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-yellow-400">3. États du réseau & Connexions TCP/UDP</span>
                  <span className="text-slate-500">Sockets vivants, sessions actives</span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-cyan-400">4. Systèmes de fichiers locaux (Disque dur / SSD)</span>
                  <span className="text-slate-500">Non volatile (MFT, journaux USN)</span>
                </div>
                <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="font-bold text-slate-400">5. Médias de sauvegarde & Archives</span>
                  <span className="text-slate-500">Persistant</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4" /> Principaux Plugins Volatility 3 pour l'Analyse RAM
                </h4>
                <p className="text-slate-300 text-xs">
                  Commandes standard à exécuter face à un fichier dump mémoire :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">vol.py windows.pslist</span>
                  <p className="text-slate-400 font-sans">Affiche la liste chaînée EPROCESS des processus. Permet de repérer les noms suspects et les dates de lancement.</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <span className="text-rose-400 font-bold block mb-1">vol.py windows.malfind</span>
                  <p className="text-slate-400 font-sans">Détecte les zones mémoires marquées RWX (Read/Write/Execute) contenant des entêtes injectés (ex: MZ/PE header).</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">vol.py windows.netscan</span>
                  <p className="text-slate-400 font-sans">Scanne les connexions réseau actives et closes associées aux PIDs pour identifier les canaux C2.</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                  <span className="text-purple-400 font-bold block mb-1">vol.py windows.pstree</span>
                  <p className="text-slate-400 font-sans">Structure hiérarchique parent/enfant. Révèle si un svchost.exe a été lancé par explorer.exe au lieu de services.exe.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'disk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <h4 className="font-bold text-cyan-400 flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4" /> Artéfacts de Preuve d'Exécution & Persistance
                </h4>
                <p className="text-slate-300 text-xs">
                  Les éléments légaux incontournables sous Windows :
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">Prefetch (C:\Windows\Prefetch\*.pf)</span>
                  <p className="text-slate-400">Prouve qu'un exécutable a tourné sur la machine, fournit le nombre d'exécutions et les 8 derniers horodatages.</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">Clés de Registre Run & RunOnce</span>
                  <p className="text-slate-400"><code>HKCU\Software\Microsoft\Windows\CurrentVersion\Run</code> : Mécanisme de démarrage automatique numéro 1 des malwares.</p>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">Journal des Événements Windows (EVTX)</span>
                  <p className="text-slate-400">Event ID 4624 (Logon), Event ID 4625 (Failed Logon), Event ID 7045 (Nouveau Service installé, ex: PsExec), Event ID 4688 (Process Creation).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'custody' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4" /> Intégrité & Chaîne de Traçabilité (Chain of Custody)
                </h4>
                <p className="text-slate-300 text-xs">
                  Règles strictes pour garantir la recevabilité juridique des preuves forensiques :
                </p>
              </div>

              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Calcul des Empreintes Cryptographiques (Hachage) :</strong> Toujours calculer et noter le SHA-256 de l'image disque ou mémoire immédiatement après acquisition et avant toute analyse.</span>
                </li>
                <li className="flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Analyse Exclusive sur Copie Bit-à-Bit :</strong> Ne JAMAIS analyser ou monter la preuve originale. Toujours travailler sur une copie conforme en écriture verrouillée (Write Blocker).</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>DFIR SANS Institute & NIST SP 800-86 Standards</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Fermer le Guide
          </button>
        </div>
      </div>
    </div>
  );
}
