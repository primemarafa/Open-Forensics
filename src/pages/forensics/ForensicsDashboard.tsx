import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HardDrive, Cpu, FileText, Clock, Network, Globe, Database } from 'lucide-react';
import { forensicsScenarios } from '../../data/forensics';
import ScenarioCard from '../../components/shared/ScenarioCard';
import { useProgressStore } from '../../stores/useProgressStore';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'disk': return <HardDrive className="w-6 h-6 text-blue-500" />;
    case 'memory': return <Cpu className="w-6 h-6 text-yellow-500" />;
    case 'log': return <FileText className="w-6 h-6 text-green-500" />;
    case 'timeline': return <Clock className="w-6 h-6 text-red-500" />;
    case 'network': return <Network className="w-6 h-6 text-purple-500" />;
    case 'browser': return <Globe className="w-6 h-6 text-orange-500" />;
    case 'registry': return <Database className="w-6 h-6 text-indigo-500" />;
    default: return <FileText className="w-6 h-6 text-gray-500" />;
  }
};

const ForensicsDashboard: React.FC = () => {
  const { t } = useTranslation(['forensics', 'common']);
  const navigate = useNavigate();
  const isCompleted = useProgressStore((state) => state.isCompleted);
  const getBestScore = useProgressStore((state) => state.getBestScore);

  const categories = Array.from(new Set(forensicsScenarios.map(s => s.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('forensics:dashboard.title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t('forensics:dashboard.description')}</p>
      </div>

      <div className="space-y-12">
        {categories.map(category => {
          const categoryScenarios = forensicsScenarios.filter(s => s.category === category);
          return (
            <div key={category}>
              <div className="flex items-center space-x-3 mb-6">
                {getCategoryIcon(category)}
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
                  {t(`forensics:categories.${category}`)}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryScenarios.map(scenario => {
                  const completed = isCompleted(scenario.id);
                  const bestScore = getBestScore(scenario.id);
                  return (
                    <ScenarioCard
                      key={scenario.id}
                      scenario={scenario}
                      isCompleted={completed}
                      bestScore={bestScore}
                      onClick={() => navigate(`/scenario/${scenario.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForensicsDashboard;
