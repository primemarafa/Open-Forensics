import type { ForensicsScenario } from '../../../types/forensics';

export const diskAnalysisScenario: ForensicsScenario = {
  id: 'disk-persistence',
  module: 'forensics',
  category: 'disk',
  titleKey: 'scenarios.disk-persistence.title',
  descriptionKey: 'scenarios.disk-persistence.description',
  difficulty: 'easy',
  estimatedTime: 15,
  mitreTechniques: ['T1547.001'],
  tags: ['Disk', 'Prefetch', 'Amcache', 'Persistence'],
  evidence: [
    {
      id: 'prefetch-list',
      type: 'file',
      titleKey: 'Prefetch Artifacts',
      data: {
        artifacts: [
          { type: 'prefetch', timestamp: '2023-10-28T14:22:10Z', path: 'C:\\Windows\\Prefetch\\CMD.EXE-4A81B364.pf', details: { runCount: '42', lastRun: '2023-10-28T14:22:10Z' } },
          { type: 'prefetch', timestamp: '2023-10-28T14:25:33Z', path: 'C:\\Windows\\Prefetch\\POWERSHELL.EXE-B8A61366.pf', details: { runCount: '15', lastRun: '2023-10-28T14:25:33Z' } },
          { type: 'prefetch', timestamp: '2023-10-28T14:30:15Z', path: 'C:\\Windows\\Prefetch\\EVIL.EXE-91F3A2B5.pf', details: { runCount: '1', lastRun: '2023-10-28T14:30:15Z' } }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'multiple-choice', questionKey: 'scenarios.disk-persistence.q1',
      options: [
        { key: 'scenarios.disk-persistence.q1_opt1', value: 'CMD.EXE' },
        { key: 'scenarios.disk-persistence.q1_opt2', value: 'POWERSHELL.EXE' },
        { key: 'scenarios.disk-persistence.q1_opt3', value: 'EVIL.EXE' }
      ],
      correctAnswer: 'EVIL.EXE',
      explanationKey: 'scenarios.disk-persistence.q1_exp',
      points: 20
    }
  ],
  forensicsData: {
    diskArtifacts: [
      { type: 'prefetch', timestamp: '2023-10-28T14:30:15Z', path: 'C:\\Windows\\Prefetch\\EVIL.EXE-91F3A2B5.pf', details: { runCount: '1', lastRun: '2023-10-28T14:30:15Z', originalPath: 'C:\\Users\\User\\Downloads\\evil.exe' } }
    ]
  }
};
