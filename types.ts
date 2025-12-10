export type Gender = 'M' | 'F';
export type Source = 'website' | 'app';
export type UserStatus = 'unassigned' | 'assigned' | 'refunded';

export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  photoUrl: string;
  description: string;
  interests: string[];
  source: Source;
  status: UserStatus;
  tableId: string | null;
  purchaseTime: string; // ISO date
  popularityScore: number; // 0 to 100
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
}

export interface TableStats {
  id: string;
  name: string;
  count: number;
  capacity: number;
  maleCount: number;
  femaleCount: number;
  percentageFull: number;
  maleRatio: number; // 0 to 1
}