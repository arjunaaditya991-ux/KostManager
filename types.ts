export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Tenant {
  id: string;
  name: string;
  roomNumber: string;
  phone: string;
  startDate: string;
  status: 'Active' | 'Inactive';
  monthlyRent: number;
}

export interface Room {
  id: string;
  number: string;
  type: 'Single' | 'Double' | 'Suite';
  price: number;
  isOccupied: boolean;
  tenantId?: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: 'Transfer' | 'Cash';
}

export interface DashboardStats {
  totalTenants: number;
  monthlyIncome: number;
  occupiedRooms: number;
  emptyRooms: number;
}
