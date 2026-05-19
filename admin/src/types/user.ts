export type UserRole = 'admin' | 'customer' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}
