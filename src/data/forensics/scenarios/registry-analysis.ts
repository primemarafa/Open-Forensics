import type { ForensicsScenario } from '../../../types/forensics';

export const registryAnalysisScenario: ForensicsScenario = {
  id: 'registry-persistence',
  module: 'forensics',
  category: 'registry',
  titleKey: 'scenarios.registry-persistence.title',
  descriptionKey: 'scenarios.registry-persistence.description',
  difficulty: 'easy',
  estimatedTime: 15,
  mitreTechniques: ['T1547.001'],
  tags: ['Registry', 'Autoruns', 'Persistence'],
  evidence: [
    {
      id: 'registry-run-keys',
      type: 'registry',
      titleKey: 'Registry Run Keys',
      data: {
        keys: [
          { hive: 'HKCU', key: 'Software\\Microsoft\\Windows\\CurrentVersion\\Run', valueName: 'OneDrive', valueData: '"C:\\Users\\User\\AppData\\Local\\Microsoft\\OneDrive\\OneDrive.exe" /background' },
          { hive: 'HKCU', key: 'Software\\Microsoft\\Windows\\CurrentVersion\\Run', valueName: 'Update', valueData: 'C:\\Users\\User\\AppData\\Local\\Temp\\update.exe' }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'multiple-choice', questionKey: 'scenarios.registry-persistence.q1',
      options: [
        { key: 'scenarios.registry-persistence.q1_opt1', value: 'OneDrive' },
        { key: 'scenarios.registry-persistence.q1_opt2', value: 'Update' }
      ],
      correctAnswer: 'Update',
      explanationKey: 'scenarios.registry-persistence.q1_exp',
      points: 15
    }
  ],
  forensicsData: {
    registryEntries: [
      { hive: 'HKCU', key: 'Software\\Microsoft\\Windows\\CurrentVersion\\Run', valueName: 'Update', valueData: 'C:\\Users\\User\\AppData\\Local\\Temp\\update.exe', valueType: 'REG_SZ', lastModified: '2023-11-04T10:00:00Z', suspicious: true }
    ]
  }
};
