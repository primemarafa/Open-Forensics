import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock } from 'lucide-react';
import { getForensicsScenarioById } from '../../data/forensics';
import EvidenceViewer from '../../components/shared/EvidenceViewer';
import QuestionPanel from '../../components/shared/QuestionPanel';
import Timer from '../../components/shared/Timer';
import DifficultyBadge from '../../components/shared/DifficultyBadge';
import { calculateScore } from '../../utils/scoring';
import { useProgressStore } from '../../stores/useProgressStore';

export default function ForensicsScenario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['forensics', 'common']);
  
  const scenario = getForensicsScenarioById(id || '');
  const addResult = useProgressStore((state) => state.addResult);

  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (!scenario) {
      navigate('/');
    }
  }, [scenario, navigate]);

  const handleSubmit = useCallback((finalAnswers: Record<string, any>) => {
    if (!scenario) return;
    
    const { score, maxScore } = calculateScore(scenario.questions, finalAnswers);
    
    addResult({
      scenarioId: scenario.id,
      score,
      maxScore,
      timeSpent,
      answers: finalAnswers,
      completedAt: new Date().toISOString()
    });

    navigate(`/results/${scenario.id}`);
  }, [scenario, timeSpent, addResult, navigate]);

  if (!scenario) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#070a11] text-slate-100 overflow-hidden font-sans">
      {/* Sleek DFIR Laboratory Case Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/60 transition-colors text-xs font-mono cursor-pointer shrink-0"
            title="Quitter le cas forensique et retourner au laboratoire"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quitter Laboratoire</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block shrink-0"></div>

          {/* Scenario Meta & Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Expertise DFIR Active
              </span>

              <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                {scenario.category}
              </span>

              <div className="hidden sm:block">
                <DifficultyBadge difficulty={scenario.difficulty} />
              </div>
            </div>

            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-md sm:max-w-xl">
              {t(scenario.titleKey, { defaultValue: scenario.id })}
            </h1>
          </div>
        </div>

        {/* Live Metrics & Timer */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
          {scenario.estimatedTime && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Cible: {scenario.estimatedTime} min</span>
            </div>
          )}

          <Timer initialTime={0} isRunning={true} onTimeUpdate={setTimeSpent} />
        </div>
      </header>

      {/* Main Split Console: Evidence & Volatility CLI (60%) | Questions & Methodology (40%) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 sm:p-4 gap-3 sm:gap-4">
        {/* Left Side: Forensic Evidence & CLI Explorer */}
        <div className="w-full lg:w-3/5 h-full overflow-hidden rounded-2xl border border-slate-800/80 shadow-xl bg-slate-950/60 flex flex-col">
          <EvidenceViewer evidence={scenario.evidence} translationNamespace="forensics" />
        </div>

        {/* Right Side: Investigator Technical Desk */}
        <div className="w-full lg:w-2/5 h-full overflow-hidden rounded-2xl border border-slate-800/80 shadow-xl bg-slate-950/60 flex flex-col">
          <QuestionPanel 
            questions={scenario.questions} 
            onSubmit={handleSubmit}
            showResults={false}
            results={{}}
            translationNamespace="forensics"
          />
        </div>
      </main>
    </div>
  );
}
