
export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Node {
  id: string;
  label: string;
  type: 'subject' | 'topic' | 'task';
  status: 'pending' | 'in-progress' | 'completed';
  difficulty: number;
  cognitiveLoad: number;
  importance: number;
}

export interface Weights {
  academic: number;
  skill: number;
  efficiency: number;
  wellbeing: number;
}

export interface Responsibility {
  id: string;
  label: string;
  active: boolean;
  weightPenalty: number;
}

export interface SecurityConfig {
  biometrics: boolean;
  parentalAccessKey: string;
  allowParentReports: boolean;
  allowParentLoad: boolean;
  allowParentNotes: boolean;
}

export interface SystemNotification {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'alert' | 'success';
}

export interface GlobalState {
  user: User | null;
  isAuthenticated: boolean;
  weights: Weights;
  responsibilities: Responsibility[];
  security: SecurityConfig;
  mentalBattery: number;
  tasks: Node[];
  notifications: SystemNotification[];
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface OptimizedPath {
  steps: string[];
  totalEstimatedTime: number;
  reasoning: string;
}

export type ViewType = 'dashboard' | 'knowledge-graph' | 'optimizer' | 'ai-tutor' | 'priority-config' | 'security' | 'reports' | 'auth';
