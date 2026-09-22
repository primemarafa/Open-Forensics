import type { Scenario } from './scenario';

export interface ProcessInfo {
  pid: number;
  ppid: number;
  name: string;
  path: string;
  cmdline: string;
  user: string;
  startTime: string;
  connections?: { localAddr: string; remoteAddr: string; state: string }[];
  dlls?: string[];
  suspicious?: boolean;
}

export interface DiskArtifact {
  type: 'prefetch' | 'amcache' | 'shellbag' | 'mft' | 'usnjrnl' | 'lnk' | 'jumplist';
  timestamp: string;
  path: string;
  details: Record<string, string>;
}

export interface RegistryEntry {
  hive: string;
  key: string;
  valueName: string;
  valueData: string;
  valueType: string;
  lastModified: string;
  suspicious?: boolean;
}

export interface BrowserArtifact {
  type: 'history' | 'cookie' | 'download' | 'cache' | 'autofill' | 'bookmark';
  browser: string;
  timestamp: string;
  url?: string;
  title?: string;
  details: Record<string, string>;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  source: string;
  category: string;
  description: string;
  details: Record<string, string>;
  isMalicious?: boolean;
}

export interface LogEntry {
  timestamp: string;
  source: string;
  eventId?: number;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  details?: Record<string, string>;
}

export type ForensicsScenario = Scenario & {
  module: 'forensics';
  forensicsData?: {
    processes?: ProcessInfo[];
    diskArtifacts?: DiskArtifact[];
    registryEntries?: RegistryEntry[];
    browserArtifacts?: BrowserArtifact[];
    timelineEvents?: TimelineEvent[];
    logEntries?: LogEntry[];
  };
};
