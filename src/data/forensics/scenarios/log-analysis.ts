import type { ForensicsScenario } from '../../../types/forensics';

export const logAnalysisScenario: ForensicsScenario = {
  id: 'log-lateral-movement',
  module: 'forensics',
  category: 'log',
  titleKey: 'scenarios.log-lateral-movement.title',
  descriptionKey: 'scenarios.log-lateral-movement.description',
  difficulty: 'medium',
  estimatedTime: 25,
  mitreTechniques: ['T1021.002'],
  tags: ['Event Logs', 'Lateral Movement', 'SMB'],
  evidence: [
    {
      id: 'event-logs',
      type: 'log',
      titleKey: 'Windows Event Logs',
      data: {
        logs: [
          { timestamp: '2023-10-29T10:15:00Z', source: 'Security', eventId: 4624, level: 'info', category: 'Logon', message: 'An account was successfully logged on.', details: { LogonType: '3', AccountName: 'Administrator', SourceNetworkAddress: '192.168.1.105' } },
          { timestamp: '2023-10-29T10:15:02Z', source: 'Security', eventId: 4672, level: 'info', category: 'Special Logon', message: 'Special privileges assigned to new logon.', details: { AccountName: 'Administrator' } },
          { timestamp: '2023-10-29T10:15:05Z', source: 'System', eventId: 7045, level: 'warning', category: 'Service Control Manager', message: 'A new service was installed in the system.', details: { ServiceName: 'PSEXESVC', ImagePath: 'C:\\Windows\\PSEXESVC.exe' } }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'multiple-choice', questionKey: 'scenarios.log-lateral-movement.q1',
      options: [
        { key: 'scenarios.log-lateral-movement.q1_opt1', value: 'RDP Logon' },
        { key: 'scenarios.log-lateral-movement.q1_opt2', value: 'Network Logon' },
        { key: 'scenarios.log-lateral-movement.q1_opt3', value: 'Interactive Logon' }
      ],
      correctAnswer: 'Network Logon',
      explanationKey: 'scenarios.log-lateral-movement.q1_exp',
      points: 20
    }
  ],
  forensicsData: {
    logEntries: [
      { timestamp: '2023-10-29T10:15:00Z', source: 'Security', eventId: 4624, level: 'info', category: 'Logon', message: 'An account was successfully logged on.', details: { LogonType: '3', AccountName: 'Administrator', SourceNetworkAddress: '192.168.1.105' } },
      { timestamp: '2023-10-29T10:15:05Z', source: 'System', eventId: 7045, level: 'warning', category: 'Service Control Manager', message: 'A new service was installed in the system.', details: { ServiceName: 'PSEXESVC', ImagePath: 'C:\\Windows\\PSEXESVC.exe' } }
    ]
  }
};
