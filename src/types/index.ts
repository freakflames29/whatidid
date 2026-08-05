export interface AppConfig {
  apiKey: string;
  model: string;
}

export interface CommitInfo {
  hash: string;
  message: string;
  date: string;
}

export interface AIReport {
  project: string;
  tasks: string[];
}
