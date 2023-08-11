import {z} from 'zod';
import {
  nameSchema,
  namespaceSchema,
} from '@CounterService/CounterService.types';
import {unwrapInvalidData} from '@shared/types';
import type {RowDataPacket} from 'mysql2/promise';

const counterTableSchema = z.object({
  id: z.number().min(1),
  namespace: namespaceSchema,
  name: nameSchema,
  createdAtUtc: z.coerce.date(),
  deleted: z.coerce.date().nullable(),
  deletedAtUtc: z.coerce.date().nullable(),
});

export const hasInvalidCounterData = (row: unknown) =>
  unwrapInvalidData(counterTableSchema)(row);

export type CounterData = z.infer<typeof counterTableSchema>;

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

export interface SelectCounterResult extends RowDataPacket, CounterData {}

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
