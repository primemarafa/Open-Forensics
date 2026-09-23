import type { ForensicsScenario } from '../../types/forensics';
import { memoryAnalysisScenario } from './scenarios/memory-analysis';
import { diskAnalysisScenario } from './scenarios/disk-analysis';
import { logAnalysisScenario } from './scenarios/log-analysis';
import { timelineForensicsScenario } from './scenarios/timeline-forensics';
import { networkForensicsScenario } from './scenarios/network-forensics';
import { browserArtifactsScenario } from './scenarios/browser-artifacts';
import { registryAnalysisScenario } from './scenarios/registry-analysis';
import { lsassDumpScenario } from './scenarios/lsass-dump';

export const forensicsScenarios: ForensicsScenario[] = [
  memoryAnalysisScenario,
  lsassDumpScenario,
  diskAnalysisScenario,
  logAnalysisScenario,
  timelineForensicsScenario,
  networkForensicsScenario,
  browserArtifactsScenario,
  registryAnalysisScenario,
];

export const getForensicsScenarioById = (id: string): ForensicsScenario | undefined =>
  forensicsScenarios.find(s => s.id === id);
