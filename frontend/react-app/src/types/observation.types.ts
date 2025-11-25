export interface Observation {
  id: number;
  content: string;
  user_id: number;
  username: string;
  created_at: string;
  accepted_at?: string;
  status: string;
  project_name: string;
}