import {
  selectId,
  selectHitCount,
  selectHitCountById,
  insertCounter,
  insertCounterHit,
} from '@CounterService/CounterRepository';
import {
  getOkPacketMock,
  prepareExecuteSingleHandlerMock,
  prepareQueryHandlerMock,
} from '@shared/MySQL/mysqlHelper.mocks';
import {
  counterQueryHandler,
  counterExecuteSingleHandler,
} from './CounterRepository.utils';
import {FieldPacket, OkPacket, RowDataPacket} from 'mysql2/promise';

jest.mock('./CounterRepository.utils', () => ({
  counterExecuteSingleHandler: jest.fn(),
  counterQueryHandler: jest.fn(),
}));

const mockCounterExecuteSingleHandler =
  counterExecuteSingleHandler as jest.Mock;
const mockCounterQueryHandler = counterQueryHandler as jest.Mock;

const TEST_NAMESPACE = 'Test_Namespace';
const TEST_NAME = 'Test_Name';
const TEST_ID = 1000;

describe('CounterRepository', () => {
  it.each<[string, () => Promise<[unknown[], FieldPacket[]]>]>([
    ['selectId', () => selectId(TEST_NAMESPACE, TEST_NAME)],
    ['selectHitCount', () => selectHitCount(TEST_NAMESPACE, TEST_NAME)],
    ['selectHitCountById', () => selectHitCountById(TEST_ID)],
  ])(
    'delegates %p calls to the counterQueryHandler',
    async (_case, callback) => {
      const mockResult = {rows: ['testResult']};

      prepareQueryHandlerMock(mockCounterQueryHandler, [
        mockResult as RowDataPacket,
      ]);

      const [result] = await callback();

      expect(mockCounterQueryHandler).toHaveBeenCalled();
      expect(result).toStrictEqual([mockResult]);
    },
  );

  it.each<[string, () => Promise<[OkPacket, FieldPacket[]]>]>([
    ['insertCounter', () => insertCounter(TEST_NAMESPACE, TEST_NAME)],
    ['insertCounterHit', () => insertCounterHit(TEST_ID)],
  ])(
    'delegates %p calls to the counterExecuteSingleHandler',
    async (_case, callback) => {
      const mockResult = getOkPacketMock({});

      prepareExecuteSingleHandlerMock(mockCounterExecuteSingleHandler, {
        okPacket: mockResult,
      });

      const [result] = await callback();

      expect(mockCounterExecuteSingleHandler).toHaveBeenCalled();
      expect(result).toStrictEqual(mockResult);
    },
  );
});
