import type {RowDataPacket} from 'mysql2/promise';

export interface SelectIdData {
  id: number;
}

export interface HitCountData {
  hits: number;
}

export interface SelectIdResult extends RowDataPacket, SelectIdData {}

export interface HitCountResult extends RowDataPacket, HitCountData {}

export function getRowDataPacket<TData>(data: TData) {
  return {
    constructor: {
      name: 'RowDataPacket',
    } as const,
    ...data,
  };
}
