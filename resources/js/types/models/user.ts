export interface User {
  id: number;
  name: string;
  email: string;
  role: 'root' | 'admin' | 'student';
  created_at: string;
  updated_at: string;
}
