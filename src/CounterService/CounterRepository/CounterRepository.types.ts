import type {RowDataPacket} from 'mysql2/promise';

export interface SelectIdResult extends RowDataPacket {
  id: number;
}

export interface HitCountResult extends RowDataPacket {
  hits: number;
}

export function getSelectIdResult(id: number): SelectIdResult {
  return {
    constructor: {
      name: 'RowDataPacket',
    },
    id,
  };
}

export const getHitCountResult = (hits: number): HitCountResult => ({
  constructor: {
    name: 'RowDataPacket',
  },
  hits,
});
