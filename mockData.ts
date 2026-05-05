import { Tenant, Room, Transaction } from './types';

export const mockTenants: Tenant[] = [
  { id: '1', name: 'Budi Santoso', roomNumber: '101', phone: '08123456789', startDate: '2024-01-10', status: 'Active', monthlyRent: 1500000 },
  { id: '2', name: 'Siti Aminah', roomNumber: '102', phone: '08129876543', startDate: '2024-02-15', status: 'Active', monthlyRent: 1500000 },
  { id: '3', name: 'Rahmat Hidayat', roomNumber: '201', phone: '08134455667', startDate: '2023-12-01', status: 'Active', monthlyRent: 2000000 },
  { id: '4', name: 'Dewi Lestari', roomNumber: '202', phone: '08123344556', startDate: '2024-03-01', status: 'Active', monthlyRent: 2000000 },
];

export const mockRooms: Room[] = [
  { id: '1', number: '101', type: 'Single', price: 1500000, isOccupied: true, tenantId: '1' },
  { id: '2', number: '102', type: 'Single', price: 1500000, isOccupied: true, tenantId: '2' },
  { id: '3', number: '103', type: 'Single', price: 1500000, isOccupied: false },
  { id: '4', number: '201', type: 'Double', price: 2000000, isOccupied: true, tenantId: '3' },
  { id: '5', number: '202', type: 'Double', price: 2000000, isOccupied: true, tenantId: '4' },
  { id: '6', number: '203', type: 'Double', price: 2000000, isOccupied: false },
  { id: '7', number: '301', type: 'Suite', price: 3500000, isOccupied: false },
];

export const mockTransactions: Transaction[] = [
  { id: 'T1', tenantId: '1', tenantName: 'Budi Santoso', amount: 1500000, date: '2024-04-01', status: 'Paid', method: 'Transfer' },
  { id: 'T2', tenantId: '2', tenantName: 'Siti Aminah', amount: 1500000, date: '2024-04-02', status: 'Paid', method: 'Cash' },
  { id: 'T3', tenantId: '3', tenantName: 'Rahmat Hidayat', amount: 2000000, date: '2024-04-03', status: 'Pending', method: 'Transfer' },
  { id: 'T4', tenantId: '4', tenantName: 'Dewi Lestari', amount: 2000000, date: '2024-03-25', status: 'Overdue', method: 'Transfer' },
];

export const analyticsData = [
  { month: 'Jan', revenue: 4500000 },
  { month: 'Feb', revenue: 5200000 },
  { month: 'Mar', revenue: 6000000 },
  { month: 'Apr', revenue: 7000000 },
  { month: 'Mei', revenue: 6500000 },
  { month: 'Jun', revenue: 8000000 },
];
