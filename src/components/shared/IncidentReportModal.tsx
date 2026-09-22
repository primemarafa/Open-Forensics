import { useState } from 'react';
import { FileText, Copy, Check, Download, X, Shield, Award } from 'lucide-react';
import type { ForensicsScenario } from '../../types/forensics';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ForensicsScenario;
  score: number;
  maxScore: number;
  timeSpent: number;
  answers: Record<string, any>;
}

export default function IncidentReportModal({
  isOpen,
  onClose,
  scenario,
  score,
  maxScore,
  timeSpent,
  answers,
}: IncidentReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const dateStr = new Date().toISOString().split('T')[0];
  const timeFormatted = `${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s`;

  const reportMarkdown = `# 🔬 RAPPORT D'INVESTIGATION NUMÉRIQUE FORENSIQUE (DFIR)
**Dossier d'expertise :** DFIR-CASE-${scenario.id.toUpperCase()}-${new Date().getFullYear()}  
**Date d'examen :** ${dateStr}  
**Examinateur / Expert Forensique :** Analyste DFIR L2 / Incident Responder  
**Statut de la Preuve :** ANALYSE BIT-À-BIT COMPLÉTÉE  
**Classification de l'incident :** ${scenario.difficulty.toUpperCase()}  

---

## 1. Synthèse de l'Investigation Numérique
Une analyse technique a été conduite sur les artéfacts volatils et non-volatils associés au cas **${scenario.category.toUpperCase()}**.
L'investigation a respecté les directives de la norme RFC 3227 (ordre de volatilité) et la chaîne de conservation des preuves numériques.

- **Score de résolution du cas :** ${score} / ${maxScore} (${percentage}%)
- **Temps d'analyse :** ${timeFormatted}
- **Fiabilité des conclusions :** ${percentage >= 80 ? 'ÉTABLIE SANS AMBIGUÏTÉ' : percentage >= 60 ? 'PROBABLE' : 'INDICES INSUFFISANTS'}

---

## 2. Cartographie des Tactiques et Techniques (MITRE ATT&CK)
Les artéfacts identifiés confirment l'utilisation des techniques adverses suivantes :
${scenario.mitreTechniques?.map((t) => `- **${t}**`).join('\n') || '- Non spécifié'}

---

## 3. Résultats des Examens & Questions d'Expertise
${scenario.questions
  .map(
    (q, idx) => `### Question Technique ${idx + 1} :
- **Constat de l'analyste :** \`${answers[q.id] || 'Non renseigné'}\`
- **Résultat attendu / Preuve déterminante :** \`${q.correctAnswer}\`
`
  )
  .join('\n')}

---

## 4. Recommandations Forensiques & Actions Immédiates
1. **Préservation des preuves :** Conserver sous scellé numérique l'image brute (SHA-256 certifié).
2. **Recherche de compromission étendue (Threat Hunting) :** Scanner l'ensemble du parc endpoint avec les IOCs extraits (hashes, IP C2, DLL suspecte).
3. **Mise à jour des règles de détection :** Intégrer les signatures YARA et règles SIGMA développées au cours de cette expertise.

*Rapport d'expertise certifié via Open-Forensics.*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAPPORT_DFIR_${scenario.id.toUpperCase()}_${dateStr}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono">
                Rapport d'Expertise DFIR : CASE-{scenario.id.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400">Rapport d'investigation certifié prêt pour restitution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-950/60 font-mono text-xs">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Forensics Investigation Record
              </span>
              <span className="text-slate-500">{dateStr}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400 text-[11px]">
              <div><span className="text-slate-500 block">Dossier :</span> <span className="text-slate-200">{scenario.id}</span></div>
              <div><span className="text-slate-500 block">Difficulté :</span> <span className="text-amber-400">{scenario.difficulty}</span></div>
              <div><span className="text-slate-500 block">Score :</span> <span className="text-cyan-400 font-bold">{percentage}%</span></div>
              <div><span className="text-slate-500 block">Temps :</span> <span className="text-slate-200">{timeFormatted}</span></div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <pre className="whitespace-pre-wrap font-mono text-slate-300 leading-relaxed text-xs">
              {reportMarkdown}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Award className="w-4 h-4 text-cyan-400" /> Export conforme aux standards d'investigation DFIR
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
