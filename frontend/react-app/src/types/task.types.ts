export interface Task {
  id: number;
  title: string;
  status: string;
  necessity: string;
  quantity: string;
  start_date: string;
  end_date: string;
  resolves_by_itself: boolean;
}