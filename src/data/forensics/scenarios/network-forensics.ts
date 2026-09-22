import type { ForensicsScenario } from '../../../types/forensics';

export const networkForensicsScenario: ForensicsScenario = {
  id: 'network-dns-exfiltration',
  module: 'forensics',
  category: 'network',
  titleKey: 'scenarios.network-dns-exfiltration.title',
  descriptionKey: 'scenarios.network-dns-exfiltration.description',
  difficulty: 'medium',
  estimatedTime: 20,
  mitreTechniques: ['T1048.003'],
  tags: ['Network', 'DNS', 'Exfiltration', 'PCAP'],
  evidence: [
    {
      id: 'pcap-analysis',
      type: 'pcap',
      titleKey: 'DNS PCAP Analysis',
      data: {
        queries: [
          { timestamp: '2023-11-02T12:00:01Z', src: '192.168.1.100', dst: '8.8.8.8', query: 'www.google.com' },
          { timestamp: '2023-11-02T12:05:10Z', src: '192.168.1.100', dst: '8.8.8.8', query: '5647382910.evil-domain.com' },
          { timestamp: '2023-11-02T12:05:11Z', src: '192.168.1.100', dst: '8.8.8.8', query: 'AABBCCDDEE.evil-domain.com' }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'multiple-choice', questionKey: 'scenarios.network-dns-exfiltration.q1',
      options: [
        { key: 'scenarios.network-dns-exfiltration.q1_opt1', value: 'evil-domain.com' },
        { key: 'scenarios.network-dns-exfiltration.q1_opt2', value: 'google.com' }
      ],
      correctAnswer: 'evil-domain.com',
      explanationKey: 'scenarios.network-dns-exfiltration.q1_exp',
      points: 20
    }
  ]
};
