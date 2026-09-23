import type { ForensicsScenario } from '../../../types/forensics';

export const lsassDumpScenario: ForensicsScenario = {
  id: 'lsass-memory-dump',
  module: 'forensics',
  category: 'memory',
  titleKey: 'Autopsie Mémoire : Dump LSASS & Mouvement Latéral Pass-the-Hash',
  descriptionKey: 'Investigation avancée sur un dump du processus d\'autorité de sécurité locale (LSASS) ciblé par Mimikatz pour l\'exfiltration de credentials NTLM et Kerberos.',
  difficulty: 'hard',
  estimatedTime: 25,
  mitreTechniques: ['T1003.001', 'T1550.002', 'T1059.001'],
  tags: ['Memory Forensics', 'LSASS', 'ProcDump', 'Mimikatz', 'Pass-the-Hash', 'Active Directory'],
  evidence: [
    {
      id: 'process-evidence-lsass',
      type: 'process',
      titleKey: 'Processus Volatils : Liste Mémoire & Détection d\'Injection',
      data: {
        processes: [
          { pid: 4, ppid: 0, name: 'System', path: 'ntoskrnl.exe', cmdline: 'System', user: 'SYSTEM', startTime: '2026-09-22T06:00:00Z', suspicious: false },
          { pid: 580, ppid: 512, name: 'winlogon.exe', path: 'C:\\Windows\\System32\\winlogon.exe', cmdline: 'winlogon.exe', user: 'SYSTEM', startTime: '2026-09-22T06:00:03Z', suspicious: false },
          { pid: 648, ppid: 580, name: 'lsass.exe', path: 'C:\\Windows\\System32\\lsass.exe', cmdline: 'C:\\Windows\\system32\\lsass.exe', user: 'NT AUTHORITY\\SYSTEM', startTime: '2026-09-22T06:00:04Z', suspicious: false },
          { pid: 4812, ppid: 3204, name: 'procdump64.exe', path: 'C:\\Users\\Public\\procdump64.exe', cmdline: 'procdump64.exe -ma 648 C:\\Windows\\Temp\\lsass.dmp -accepteula', user: 'CORP\\service_admin', startTime: '2026-09-22T09:41:12Z', suspicious: true },
          { pid: 5120, ppid: 4812, name: 'powershell.exe', path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', cmdline: 'powershell.exe -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAA...', user: 'CORP\\service_admin', startTime: '2026-09-22T09:43:00Z', suspicious: true }
        ]
      }
    },
    {
      id: 'volatility-terminal-dump',
      type: 'log',
      titleKey: 'Rapport Volatility : Handles & Malfind sur LSASS (PID 648)',
      data: {
        volatility_plugin: 'windows.handles',
        target_pid: 648,
        findings: [
          {
            handle_id: '0x12a4',
            access_mask: '0x001FFFFF (PROCESS_ALL_ACCESS)',
            opened_by_pid: 4812,
            opened_by_process: 'procdump64.exe',
            type: 'Process Handle',
            notes: 'Élévation des privilèges avec SeDebugPrivilege activé pour copier la mémoire virtuelle de LSASS.'
          },
          {
            handle_id: '0x13c0',
            access_mask: '0x10000000 (GENERIC_ALL)',
            opened_by_pid: 4812,
            opened_by_process: 'procdump64.exe',
            type: 'File Handle',
            target_file: 'C:\\Windows\\Temp\\lsass.dmp',
            notes: 'Fichier mémoire créé sur le disque.'
          }
        ]
      }
    }
  ],
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      questionKey: 'Quel outil binaire (Living-off-the-Land / Sysinternals) a été détourné pour extraire la mémoire de LSASS ?',
      options: [
        { key: 'procdump64.exe', value: 'procdump64.exe' },
        { key: 'notepad.exe', value: 'notepad.exe' },
        { key: 'vssadmin.exe', value: 'vssadmin.exe' },
        { key: 'certutil.exe', value: 'certutil.exe' }
      ],
      correctAnswer: 'procdump64.exe',
      explanationKey: 'ProcDump est un outil officiel Microsoft Sysinternals souvent détourné par les attaquants car il est signé numériquement et permet de dumper la mémoire complète du processus (-ma) sans déclencher immédiatement les alertes simples.',
      points: 25
    },
    {
      id: 'q2',
      type: 'free-text',
      questionKey: 'Quel est le chemin complet du fichier dump mémoire écrit sur la machine victime ?',
      correctAnswer: 'C:\\Windows\\Temp\\lsass.dmp',
      explanationKey: 'La ligne de commande de procdump64.exe indique explicitement l\'écriture dans C:\\Windows\\Temp\\lsass.dmp.',
      points: 25
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      questionKey: 'Quelle technique d\'attaque le pirate peut-il déployer avec les hashes NTLM extraits pour se propager sur le domaine sans connaître les mots de passe clairs ?',
      options: [
        { key: 'Pass-the-Hash (PtH / MITRE T1550.002)', value: 'pass-the-hash' },
        { key: 'SQL Injection aveugle', value: 'sqli' },
        { key: 'Arp Spoofing sur le réseau local', value: 'arp-spoof' },
        { key: 'Attaque DDoS par amplification DNS', value: 'ddos' }
      ],
      correctAnswer: 'pass-the-hash',
      explanationKey: 'Le protocole NTLM n\'utilise pas le mot de passe en clair pour authentifier un client distant, mais uniquement son empreinte (hash NTLM). L\'attaquant peut ainsi s\'authentifier sur d\'autres serveurs du domaine directement avec le hash volé.',
      points: 25
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      questionKey: 'Quel paramètre de protection système Windows permet d\'empêcher les processus non signés (même administrateurs) de lire la mémoire de LSASS ?',
      options: [
        { key: 'Activer la protection LSA en mode protégé (RunAsPPL / PPL) et Windows Defender Credential Guard', value: 'runasppl' },
        { key: 'Désactiver le service Windows Update', value: 'disable-update' },
        { key: 'Supprimer le compte invité local', value: 'guest-account' },
        { key: 'Désactiver le protocole IPv6', value: 'disable-ipv6' }
      ],
      correctAnswer: 'runasppl',
      explanationKey: 'RunAsPPL (Protected Process Light) isole LSASS dans un conteneur sécurisé au niveau du noyau, interdisant à tout processus extérieur même avec les droits SYSTEM ou SeDebugPrivilege d\'ouvrir un handle PROCESS_ALL_ACCESS sur lsass.exe.',
      points: 25
    }
  ]
};
