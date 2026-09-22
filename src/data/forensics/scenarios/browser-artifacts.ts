import type { ForensicsScenario } from '../../../types/forensics';

export const browserArtifactsScenario: ForensicsScenario = {
  id: 'browser-compromise',
  module: 'forensics',
  category: 'browser',
  titleKey: 'scenarios.browser-compromise.title',
  descriptionKey: 'scenarios.browser-compromise.description',
  difficulty: 'easy',
  estimatedTime: 15,
  mitreTechniques: ['T1185'],
  tags: ['Browser', 'History', 'Downloads'],
  evidence: [
    {
      id: 'browser-history',
      type: 'browser',
      titleKey: 'Browser History',
      data: {
        history: [
          { timestamp: '2023-11-03T14:00:00Z', url: 'https://www.google.com/search?q=free+software' },
          { timestamp: '2023-11-03T14:05:00Z', url: 'http://malicious-site.com/download/setup.exe' }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'multiple-choice', questionKey: 'scenarios.browser-compromise.q1',
      options: [
        { key: 'scenarios.browser-compromise.q1_opt1', value: 'setup.exe' },
        { key: 'scenarios.browser-compromise.q1_opt2', value: 'chrome.exe' }
      ],
      correctAnswer: 'setup.exe',
      explanationKey: 'scenarios.browser-compromise.q1_exp',
      points: 15
    }
  ],
  forensicsData: {
    browserArtifacts: [
      { type: 'download', browser: 'Chrome', timestamp: '2023-11-03T14:05:00Z', url: 'http://malicious-site.com/download/setup.exe', details: { file: 'setup.exe' } }
    ]
  }
};
