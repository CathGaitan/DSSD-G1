export interface Ong {
  id: number;
  name: string;
}

export interface Task {
  title: string;
  necessity: string;
  start_date: string;
  end_date: string;
  resolves_by_itself: boolean;
}

export interface ProjectFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  owner_id: string;
  status: string;
}