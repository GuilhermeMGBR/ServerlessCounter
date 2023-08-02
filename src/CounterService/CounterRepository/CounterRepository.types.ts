import type {RowDataPacket} from 'mysql2/promise';

export interface SelectIdData {
  id: number;
}

export interface HitCountData {
  hits: number;
}

export interface ActiveCountersData {
  namespace: string;
  name: string;
  hits: number;
  createdAt: Date;
  lastHit: Date;
}

export interface StatusSummaryData {
  active: number | null;
  deleted: number | null;
}

export interface SelectIdResult extends RowDataPacket, SelectIdData {}

export interface HitCountResult extends RowDataPacket, HitCountData {}

export interface ActiveCountersResult
  extends RowDataPacket,
    ActiveCountersData {}

export interface StatusSummaryResult extends RowDataPacket, StatusSummaryData {}

export function getRowDataPacket<TData>(data: TData) {
  return {
    constructor: {
      name: 'RowDataPacket',
    } as const,
    ...data,
  };
}

export function getRowDataPackets<TData>(data: TData[]) {
  return data.map(getRowDataPacket);
}
