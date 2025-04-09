import { User } from './user';

export interface Student {
  id: number;
  code: string;
  user_id: number;
  user: User;
  active_loans_count: number;  created_at: string;
  updated_at: string;
}
