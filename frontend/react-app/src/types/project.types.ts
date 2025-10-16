import type { Task } from './task.types';

export interface ProjectFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  owner_id: number;
  status: string;
}

export interface ShowProject {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  owner_id: number;
  status: 'active' | 'completed';
  tasks: Task[];
}