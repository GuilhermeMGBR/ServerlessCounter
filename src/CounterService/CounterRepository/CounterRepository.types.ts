import {RowDataPacket} from 'mysql2/promise';

export interface SelectIdResult extends RowDataPacket {
  id: number;
}

export interface HitCountResult extends RowDataPacket {
  hits: number;
}
