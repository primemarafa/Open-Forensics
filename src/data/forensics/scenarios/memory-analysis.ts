import type { ForensicsScenario } from '../../../types/forensics';

export const memoryAnalysisScenario: ForensicsScenario = {
  id: 'memory-injection',
  module: 'forensics',
  category: 'memory',
  titleKey: 'scenarios.memory-injection.title',
  descriptionKey: 'scenarios.memory-injection.description',
  difficulty: 'medium',
  estimatedTime: 20,
  mitreTechniques: ['T1055'],
  tags: ['Memory', 'Process Injection', 'DLL Injection', 'Volatility'],
  evidence: [
    {
      id: 'process-list',
      type: 'process',
      titleKey: 'Process List',
      data: {
        processes: [
          { pid: 4, ppid: 0, name: 'System', path: '', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:00Z' },
          { pid: 384, ppid: 4, name: 'smss.exe', path: 'C:\\Windows\\System32\\smss.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:01Z' },
          { pid: 512, ppid: 384, name: 'csrss.exe', path: 'C:\\Windows\\System32\\csrss.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:02Z' },
          { pid: 588, ppid: 384, name: 'wininit.exe', path: 'C:\\Windows\\System32\\wininit.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:03Z' },
          { pid: 652, ppid: 588, name: 'services.exe', path: 'C:\\Windows\\System32\\services.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:05Z' },
          { pid: 904, ppid: 652, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:08Z' },
          { pid: 1012, ppid: 652, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', user: 'NT AUTHORITY\\NETWORK SERVICE', startTime: '2023-10-27T08:00:09Z' },
          { pid: 1324, ppid: 652, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', user: 'NT AUTHORITY\\LOCAL SERVICE', startTime: '2023-10-27T08:00:10Z' },
          { pid: 2048, ppid: 1988, name: 'explorer.exe', path: 'C:\\Windows\\explorer.exe', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T08:05:12Z' },
          { pid: 5612, ppid: 2048, name: 'chrome.exe', path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T09:12:45Z' },
          { pid: 5892, ppid: 5612, name: 'chrome.exe', path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T09:12:46Z' },
          { pid: 4284, ppid: 2048, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T10:34:12Z', dlls: ['C:\\Users\\User\\AppData\\Local\\Temp\\msupdt.dll'], connections: [{ localAddr: '192.168.1.50:49214', remoteAddr: '185.123.45.67:443', state: 'ESTABLISHED' }] }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1', type: 'multiple-choice', questionKey: 'scenarios.memory-injection.q1',
      options: [
        { key: 'scenarios.memory-injection.q1_opt1', value: 'svchost-4284' },
        { key: 'scenarios.memory-injection.q1_opt2', value: 'explorer-2048' },
        { key: 'scenarios.memory-injection.q1_opt3', value: 'chrome-5612' },
        { key: 'scenarios.memory-injection.q1_opt4', value: 'system-4' }
      ],
      correctAnswer: 'svchost-4284',
      explanationKey: 'scenarios.memory-injection.q1_exp',
      points: 30
    },
    {
      id: 'q2', type: 'multiple-choice', questionKey: 'scenarios.memory-injection.q2',
      options: [
        { key: 'scenarios.memory-injection.q2_opt1', value: 'T1055' },
        { key: 'scenarios.memory-injection.q2_opt2', value: 'T1053' },
        { key: 'scenarios.memory-injection.q2_opt3', value: 'T1547' },
        { key: 'scenarios.memory-injection.q2_opt4', value: 'T1003' }
      ],
      correctAnswer: 'T1055',
      explanationKey: 'scenarios.memory-injection.q2_exp',
      points: 20
    }
  ],
  forensicsData: {
    processes: [
      { pid: 4, ppid: 0, name: 'System', path: '', cmdline: '', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:00Z' },
      { pid: 384, ppid: 4, name: 'smss.exe', path: 'C:\\Windows\\System32\\smss.exe', cmdline: '\\SystemRoot\\System32\\smss.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:01Z' },
      { pid: 512, ppid: 384, name: 'csrss.exe', path: 'C:\\Windows\\System32\\csrss.exe', cmdline: '%SystemRoot%\\system32\\csrss.exe ObjectDirectory=\\Windows SharedSection=1024,20480,768 Windows=On SubSystemType=Windows ServerDll=basesrv,1 ServerDll=winsrv:UserServerDllInitialization,3 ServerDll=winsrv:ConServerDllInitialization,2 ServerDll=sxssrv,4 ProfileControl=Off MaxRequestThreads=16', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:02Z' },
      { pid: 588, ppid: 384, name: 'wininit.exe', path: 'C:\\Windows\\System32\\wininit.exe', cmdline: 'wininit.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:03Z' },
      { pid: 652, ppid: 588, name: 'services.exe', path: 'C:\\Windows\\System32\\services.exe', cmdline: 'C:\\Windows\\system32\\services.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:05Z' },
      { pid: 904, ppid: 652, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', cmdline: 'C:\\Windows\\system32\\svchost.exe -k DcomLaunch', user: 'NT AUTHORITY\\SYSTEM', startTime: '2023-10-27T08:00:08Z' },
      { pid: 1012, ppid: 652, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', cmdline: 'C:\\Windows\\system32\\svchost.exe -k RPCSS', user: 'NT AUTHORITY\\NETWORK SERVICE', startTime: '2023-10-27T08:00:09Z' },
      { pid: 1324, ppid: 652, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', cmdline: 'C:\\Windows\\system32\\svchost.exe -k LocalServiceNetworkRestricted', user: 'NT AUTHORITY\\LOCAL SERVICE', startTime: '2023-10-27T08:00:10Z' },
      { pid: 2048, ppid: 1988, name: 'explorer.exe', path: 'C:\\Windows\\explorer.exe', cmdline: 'C:\\Windows\\Explorer.EXE', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T08:05:12Z' },
      { pid: 5612, ppid: 2048, name: 'chrome.exe', path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', cmdline: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T09:12:45Z' },
      { pid: 5892, ppid: 5612, name: 'chrome.exe', path: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', cmdline: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --type=renderer', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T09:12:46Z' },
      { pid: 4284, ppid: 2048, name: 'svchost.exe', path: 'C:\\Windows\\System32\\svchost.exe', cmdline: 'C:\\Windows\\system32\\svchost.exe', user: 'DESKTOP-ABC\\User', startTime: '2023-10-27T10:34:12Z', dlls: ['C:\\Windows\\System32\\ntdll.dll', 'C:\\Windows\\System32\\kernel32.dll', 'C:\\Users\\User\\AppData\\Local\\Temp\\msupdt.dll'], connections: [{ localAddr: '192.168.1.50:49214', remoteAddr: '185.123.45.67:443', state: 'ESTABLISHED' }], suspicious: true }
    ]
  }
};
