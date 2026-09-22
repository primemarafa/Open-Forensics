import type { ForensicsScenario } from '../../../types/forensics';

export const timelineForensicsScenario: ForensicsScenario = {
  id: 'timeline-reconstruction',
  module: 'forensics',
  category: 'timeline',
  titleKey: 'scenarios.timeline-reconstruction.title',
  descriptionKey: 'scenarios.timeline-reconstruction.description',
  difficulty: 'hard',
  estimatedTime: 30,
  mitreTechniques: ['T1078', 'T1059'],
  tags: ['Timeline', 'Super Timeline', 'Attack Reconstruction'],
  evidence: [
    {
      id: 'timeline-data',
      type: 'timeline',
      titleKey: 'Forensic Timeline',
      data: {
        events: [
          { id: 'evt1', timestamp: '2023-11-01T08:00:00Z', source: 'Web Log', category: 'Access', description: 'GET /login.php' },
          { id: 'evt2', timestamp: '2023-11-01T08:05:00Z', source: 'Web Log', category: 'Upload', description: 'POST /upload.php (shell.php)' },
          { id: 'evt3', timestamp: '2023-11-01T08:06:00Z', source: 'Sysmon', category: 'Process Create', description: 'cmd.exe /c whoami' }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'ordering', questionKey: 'scenarios.timeline-reconstruction.q1',
      correctAnswer: ['evt1', 'evt2', 'evt3'],
      explanationKey: 'scenarios.timeline-reconstruction.q1_exp',
      points: 30
    }
  ],
  forensicsData: {
    timelineEvents: [
      { id: 'evt1', timestamp: '2023-11-01T08:00:00Z', source: 'Web Log', category: 'Access', description: 'GET /login.php', details: {} },
      { id: 'evt2', timestamp: '2023-11-01T08:05:00Z', source: 'Web Log', category: 'Upload', description: 'POST /upload.php (shell.php)', details: {}, isMalicious: true },
      { id: 'evt3', timestamp: '2023-11-01T08:06:00Z', source: 'Sysmon', category: 'Process Create', description: 'cmd.exe /c whoami', details: {}, isMalicious: true }
    ]
  }
};
