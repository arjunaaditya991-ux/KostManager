import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function parseIndoDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  if (dateStr.includes('-')) {
    return new Date(dateStr);
  }
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const monthStr = parts[1].toLowerCase();
    const year = parseInt(parts[2]);
    const months: { [key: string]: number } = {
      januari: 0, jan: 0,
      februari: 1, feb: 1,
      maret: 2, mar: 2,
      april: 3, apr: 3,
      mei: 4,
      juni: 5, jun: 5,
      juli: 6, jul: 6,
      agustus: 7, agu: 7, ags: 7,
      september: 8, sep: 8,
      oktober: 9, okt: 9,
      november: 10, nov: 10,
      desember: 11, des: 11
    };
    const month = months[monthStr] !== undefined ? months[monthStr] : 4;
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

export function getTenantStatus(dueDate: string, currentStatus: string): 'Akan Jatuh Tempo' | 'Jatuh Tempo Hari Ini' | 'Terlambat' | 'Lunas' | 'Belum Bayar' {
  if (currentStatus === 'Lunas') {
    return 'Lunas';
  }
  
  const due = parseIndoDate(dueDate);
  const today = new Date(2026, 4, 24); // May 24, 2026 is the mock current system date
  
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'Terlambat';
  } else if (diffDays === 0) {
    return 'Jatuh Tempo Hari Ini';
  } else if (diffDays > 0 && diffDays <= 3) {
    return 'Akan Jatuh Tempo';
  } else {
    return 'Belum Bayar';
  }
}

