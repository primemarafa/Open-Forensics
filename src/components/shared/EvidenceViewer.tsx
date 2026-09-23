import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Mail, Network, Cpu, Database, Clock, Globe, File, Radio, Terminal as TerminalIcon, BookOpen } from 'lucide-react';
import type { Evidence } from '../../types/scenario';
import ForensicTerminal from '../forensics/ForensicTerminal';
import DFIRPlaybookModal from '../forensics/DFIRPlaybookModal';
import RegistryViewer from '../forensics/RegistryViewer';
import TimelineVisualizer from '../forensics/TimelineVisualizer';

interface EvidenceViewerProps {
  evidence: Evidence[];
  translationNamespace?: string;
}

const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidence, translationNamespace = 'forensics' }) => {
  const { t } = useTranslation([translationNamespace, 'common']);
  // Special tab id -1 for the Interactive Terminal
  const [activeTab, setActiveTab] = useState<number>(-1);
  const [isPlaybookOpen, setIsPlaybookOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'log': return <FileText className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'process': return <Cpu className="w-4 h-4" />;
      case 'registry': return <Database className="w-4 h-4" />;
      case 'timeline': return <Clock className="w-4 h-4" />;
      case 'browser': return <Globe className="w-4 h-4" />;
      case 'pcap': return <Radio className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const renderContent = () => {
    if (activeTab === -1) {
      return <ForensicTerminal />;
    }

    const currentEvidence = evidence[activeTab] || evidence[0];
    const data = currentEvidence.data as Record<string, any>;

    // Structured display for Process list
    if (data?.processes && Array.isArray(data.processes)) {
      return (
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-2">PPID</th>
                <th className="py-2.5 px-3">Image Name</th>
                <th className="py-2.5 px-3">Command Line / Path</th>
                <th className="py-2.5 px-2 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.processes.map((p: any, i: number) => (
                <tr key={i} className={`hover:bg-slate-800/50 ${p.suspicious ? 'bg-rose-500/10' : ''}`}>
                  <td className="py-2 px-3 text-cyan-400 font-bold">{p.pid}</td>
                  <td className="py-2 px-2 text-slate-400">{p.ppid}</td>
                  <td className="py-2 px-3 font-semibold text-slate-200">{p.name}</td>
                  <td className="py-2 px-3 text-slate-400 truncate max-w-xs">{p.cmdline || p.path}</td>
                  <td className="py-2 px-2 text-right">
                    {p.suspicious ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">SUSPECT</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">NORMAL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Windows Registry Visualizer
    if (data?.keys && Array.isArray(data.keys)) {
      return <RegistryViewer keys={data.keys} />;
    }

    // Super-Timeline Visualizer
    if (data?.events && Array.isArray(data.events)) {
      return <TimelineVisualizer events={data.events} />;
    }

    return (
      <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 overflow-x-auto">
        <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 flex flex-col h-full overflow-hidden font-sans">
      {/* Tab Navigation and Action Bar */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 pr-3">
        <div className="flex overflow-x-auto custom-scrollbar">
          {/* Interactive Terminal Tab */}
          <button
            onClick={() => setActiveTab(-1)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === -1
                ? 'border-cyan-400 text-cyan-400 bg-gray-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-gray-800/30'
            }`}
          >
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">Terminal CLI (vol.py)</span>
          </button>

          {evidence.map((item, idx) => (
            <button
              key={item.id || idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                activeTab === idx
                  ? 'border-cyan-400 text-cyan-400 bg-gray-800/50'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
              }`}
            >
              {getIcon(item.type)}
              <span>{t(item.titleKey, { defaultValue: item.titleKey || item.id })}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsPlaybookOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono transition-colors cursor-pointer shrink-0"
          title="Consulter le Playbook DFIR / Méthodologie"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Playbook DFIR</span>
        </button>
      </div>
      
      {/* Evidence Body */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-900 flex flex-col">
        {activeTab !== -1 && (
          <div className="mb-3">
            <h3 className="text-base font-bold text-gray-100 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {t(evidence[activeTab]?.titleKey, { defaultValue: evidence[activeTab]?.titleKey || evidence[activeTab]?.id })}
            </h3>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* DFIR SOP Modal */}
      <DFIRPlaybookModal isOpen={isPlaybookOpen} onClose={() => setIsPlaybookOpen(false)} />
    </div>
  );
};

export default EvidenceViewer;
