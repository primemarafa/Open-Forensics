import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Trash2, Sparkles } from 'lucide-react';

interface ForensicTerminalProps {
  scenarioId?: string;
}

interface CommandHistory {
  cmd: string;
  output: string | React.ReactNode;
}

export default function ForensicTerminal({ scenarioId: _scenarioId }: ForensicTerminalProps) {
  const [inputCmd, setInputCmd] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      cmd: 'init',
      output: (
        <div className="text-slate-400 space-y-1">
          <p className="text-cyan-400 font-bold">╔═══════════════════════════════════════════════════════════════╗</p>
          <p className="text-cyan-400 font-bold">║      DFIR Interactive Workstation — Volatility 3 v2.5.0       ║</p>
          <p className="text-cyan-400 font-bold">╚═══════════════════════════════════════════════════════════════╝</p>
          <p className="text-slate-300">Image chargée : <span className="text-amber-400">C:\Cases\Artifacts\MEMORY_DUMP.raw</span> (Windows 10 x64)</p>
          <p className="text-slate-500 text-xs">Tapez <span className="text-emerald-400 font-bold">help</span> pour afficher la liste des commandes ou cliquez sur les suggestions ci-dessous.</p>
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [executedCmds, setExecutedCmds] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    setExecutedCmds((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setInputCmd('');
      return;
    }

    let output: string | React.ReactNode = '';

    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      output = (
        <div className="space-y-1 text-slate-300">
          <p className="text-emerald-400 font-bold">Commandes d'investigation disponibles :</p>
          <p><span className="text-cyan-400 font-mono font-bold">vol.py windows.pslist</span> : Lister les processus actifs dans le dump mémoire</p>
          <p><span className="text-cyan-400 font-mono font-bold">vol.py windows.malfind</span> : Scanner les injections de code (VAD RWX cachées)</p>
          <p><span className="text-cyan-400 font-mono font-bold">vol.py windows.netscan</span> : Extraire les connexions réseau et sockets actifs</p>
          <p><span className="text-cyan-400 font-mono font-bold">vol.py windows.pstree</span> : Afficher l'arbre d'exécution des processus parents/enfants</p>
          <p><span className="text-cyan-400 font-mono font-bold">strings memory.dmp | grep -i pass</span> : Extraire les chaînes de texte / identifiants</p>
          <p><span className="text-cyan-400 font-mono font-bold">cat prefetch_analysis.log</span> : Consulter les artéfacts d'exécution Prefetch</p>
          <p><span className="text-cyan-400 font-mono font-bold">history</span> : Afficher l'historique de vos commandes</p>
          <p><span className="text-cyan-400 font-mono font-bold">clear</span> : Effacer la console</p>
        </div>
      );
    } else if (lower.includes('pslist')) {
      output = (
        <pre className="text-xs text-slate-300 leading-tight">
{`PID    PPID   ImageFileName      Offset(V)          Threads  Handles  CreateTime
4      0      System             0xfa8001a1c040     138      -        2026-09-22 08:00:12
368    4      smss.exe           0xfa8002498b30     3        32       2026-09-22 08:00:14
512    504    csrss.exe          0xfa80026e9080     11       540      2026-09-22 08:00:16
620    592    services.exe       0xfa80027f1080     8        310      2026-09-22 08:00:18
840    620    svchost.exe        0xfa80029b4080     24       490      2026-09-22 08:00:20
2048   2010   explorer.exe       0xfa8003184080     42       1180     2026-09-22 08:05:00
4284   2048   svchost.exe        0xfa8003a9f080     7        84       2026-09-22 09:18:45  <-- [!] PPID anormal (Parent: explorer.exe au lieu de services.exe)
5612   2048   chrome.exe         0xfa8004112080     38       890      2026-09-22 09:12:00`}
        </pre>
      );
    } else if (lower.includes('malfind')) {
      output = (
        <pre className="text-xs text-rose-300 bg-rose-950/20 p-2 rounded border border-rose-900/40 leading-tight">
{`[!] ALERTE MALFIND : Injection détectée dans l'espace mémoire d'un processus !

Process: svchost.exe (PID: 4284)
VAD Tag: VadS  Protection: PAGE_EXECUTE_READWRITE
Address Range: 0x0000000000400000 - 0x0000000000412000 (Size: 73728 bytes)
Hexdump des premiers octets :
4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  | MZ.............. | <-- [!] Entête PE (MZ) injecté en mémoire vive
b8 00 00 00 00 00 00 00  40 00 00 00 00 00 00 00  | ........@....... |
DLL suspecte mappée : C:\\Users\\Victim\\AppData\\Local\\Temp\\msupdt.dll`}
        </pre>
      );
    } else if (lower.includes('netscan')) {
      output = (
        <pre className="text-xs text-slate-300 leading-tight">
{`Offset(P)          Proto   Local Address          Foreign Address        State        PID    Owner
0xfa8002a11010     TCPv4   192.168.1.105:49812    185.220.101.5:443      ESTABLISHED  4284   svchost.exe <-- [!] Connexion C2 sortante
0xfa8002b44010     TCPv4   192.168.1.105:50114    142.250.179.174:443    ESTABLISHED  5612   chrome.exe
0xfa80028e9010     TCPv4   0.0.0.0:135            0.0.0.0:0              LISTENING    840    svchost.exe
0xfa80029f2010     TCPv4   0.0.0.0:445            0.0.0.0:0              LISTENING    4      System`}
        </pre>
      );
    } else if (lower.includes('pstree')) {
      output = (
        <pre className="text-xs text-slate-300 leading-tight">
{`Name                   PID     PPID    Threads   Handles   Time
System                 4       0       138       -         2026-09-22 08:00:12
. services.exe         620     592     8         310       2026-09-22 08:00:18
.. svchost.exe         840     620     24        490       2026-09-22 08:00:20 (Légitime)
. explorer.exe         2048    2010    42        1180      2026-09-22 08:05:00
.. chrome.exe          5612    2048    38        890       2026-09-22 09:12:00
.. svchost.exe         4284    2048    7         84        2026-09-22 09:18:45 [SUSPECT: Enfant d'explorer.exe]`}
        </pre>
      );
    } else if (lower.includes('strings') || lower.includes('grep')) {
      output = (
        <pre className="text-xs text-amber-300 leading-tight">
{`Matching strings found in volatile memory space (PID 4284):
[0x00401a20] POST /gateway/api/v2 HTTP/1.1
[0x00401a64] Host: update-svc-cloud.org
[0x00401aa8] User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
[0x00402100] C2_ENCRYPTION_KEY=d7f8a92b3c4e5f60
[0x00402150] cmd.exe /c whoami /all & net user & ipconfig /all`}
        </pre>
      );
    } else if (lower.includes('prefetch')) {
      output = (
        <pre className="text-xs text-slate-300 leading-tight">
{`Prefetch Parsed Records (PECfg v2.1):
POWERSHELL.EXE-8F923D10.pf  | Run Count: 47  | Last Run: 2026-09-22 09:18:40  | Volume: \\VOLUME{01d7} (Suspicious Frequency)
SVCHOST.EXE-10A93F2B.pf     | Run Count: 2   | Last Run: 2026-09-22 09:18:45  | Path: AppData\\Local\\Temp\\svchost.exe
MIMIKATZ.EXE-AA99210B.pf    | Run Count: 1   | Last Run: 2026-09-22 09:22:15  | Path: Users\\Public\\m.exe`}
        </pre>
      );
    } else if (lower === 'history') {
      output = (
        <div className="text-xs text-slate-400 space-y-0.5">
          {executedCmds.map((c, i) => (
            <p key={i}>{i + 1}  {c}</p>
          ))}
        </div>
      );
    } else {
      output = (
        <p className="text-rose-400 text-xs">
          bash: commande introuvable: <span className="font-mono text-white">{trimmed}</span>. Tapez <span className="text-emerald-400 font-bold">help</span> pour les commandes autorisées.
        </p>
      );
    }

    setHistory((prev) => [...prev, { cmd: trimmed, output }]);
    setInputCmd('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputCmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (executedCmds.length > 0) {
        const nextIdx = historyIndex + 1 < executedCmds.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputCmd(executedCmds[executedCmds.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputCmd(executedCmds[executedCmds.length - 1 - nextIdx] || '');
      } else {
        setHistoryIndex(-1);
        setInputCmd('');
      }
    }
  };

  const commandChips = [
    'vol.py windows.pslist',
    'vol.py windows.malfind',
    'vol.py windows.netscan',
    'vol.py windows.pstree',
    'strings memory.dmp | grep -i pass',
    'cat prefetch_analysis.log',
  ];

  return (
    <div className="flex flex-col h-full bg-[#0a0e14] rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f141c] border-b border-slate-800 select-none">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-slate-400 font-semibold text-[11px] ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" /> analyst@dfir-workstation: ~
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => executeCommand('clear')}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            title="Effacer la console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output Screen */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-4 overflow-y-auto space-y-3 cursor-text bg-[#0a0e14]"
      >
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.cmd !== 'init' && (
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-emerald-400 font-bold">analyst@dfir-box</span>
                <span className="text-slate-600">:</span>
                <span className="text-cyan-400 font-bold">~</span>
                <span className="text-slate-600">$</span>
                <span className="text-slate-100 font-semibold">{item.cmd}</span>
              </div>
            )}
            <div className="pl-0">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Helper Chips */}
      <div className="p-2 bg-[#0c1017] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 shrink-0 pl-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Commandes rapides :
        </span>
        {commandChips.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2 py-0.5 bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded transition-all whitespace-nowrap cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Input Prompt */}
      <div className="flex items-center px-4 py-2.5 bg-[#0f141c] border-t border-slate-800">
        <span className="text-emerald-400 font-bold mr-1">analyst@dfir-box</span>
        <span className="text-slate-600 mr-1">:</span>
        <span className="text-cyan-400 font-bold mr-1">~</span>
        <span className="text-slate-600 mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputCmd}
          onChange={(e) => setInputCmd(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tapez une commande (ex: vol.py windows.pslist) ou 'help'..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
          autoFocus
        />
        <button
          onClick={() => executeCommand(inputCmd)}
          className="p-1 text-slate-400 hover:text-cyan-400"
          title="Exécuter"
        >
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
