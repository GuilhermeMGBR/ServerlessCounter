import {FieldPacket, OkPacket, RowDataPacket} from 'mysql2/promise';
import {
  deleteCounter,
  insertCounter,
  insertCounterHit,
  select,
  selectActiveCounters,
  selectHitCount,
  selectHitCountById,
  selectId,
  selectStatusSummary,
} from '@CounterService/CounterRepository';
import {
  getOkPacketMock,
  prepareExecuteSingleHandlerMock,
  prepareQueryHandlerMock,
} from '@shared/MySQL/mysqlHelper.mocks';
import {IConnection} from '@shared/MySQL/mysqlHelper.types';
import {
  createMemoryDb,
  DbInstance,
  execute,
  getSql,
  getTestExecuteSingleHandler,
  getTestQueryHandler,
} from '@shared/SqlTest.utils';
import {hasInvalidCounterData} from './CounterRepository.types';
import {
  counterExecuteSingleHandler,
  counterQueryHandler,
} from './CounterRepository.utils';

jest.mock('./CounterRepository.utils', () => ({
  counterExecuteSingleHandler: jest.fn(),
  counterQueryHandler: jest.fn(),
}));

const mockCounterExecuteSingleHandler =
  counterExecuteSingleHandler as jest.Mock;
const mockCounterQueryHandler = counterQueryHandler as jest.Mock;

describe('CounterRepository', () => {
  const TEST_NAMESPACE = 'Test_Namespace';
  const TEST_NAME = 'Test_Name';
  const TEST_ID = 1000;

  const createTestDb = (): DbInstance => {
    const db = createMemoryDb();
    const createCounterTableSql = getSql(
      'Counter.sql',
      __dirname + '/../CounterDatabase/',
    );
    const createCounterHitTableSql = getSql(
      'CounterHit.sql',
      __dirname + '/../CounterDatabase/',
    ).split(';');

    execute(db, createCounterTableSql);
    execute(db, createCounterHitTableSql[0]);
    execute(db, createCounterHitTableSql[1]);

    return db;
  };

  const connectTestDb = (db: DbInstance) => {
    mockCounterExecuteSingleHandler.mockReturnValue(
      getTestExecuteSingleHandler(db)({} as unknown as IConnection),
    );

    mockCounterQueryHandler.mockReturnValue(
      getTestQueryHandler(db)({} as unknown as IConnection),
    );
  };

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

  describe('SQL', () => {
    beforeEach(() => {
      connectTestDb(createTestDb());
    });

    it('insert and select Counter by namespace/name', async () => {
      const name = 'name1';
      const namespace = 'namespace1';

      insertCounter(namespace, name);

      const [rows] = await select(namespace, name);

      expect(rows[0].id).toBe(1);
      expect(rows[0].name).toBe(name);
      expect(rows[0].namespace).toBe(namespace);
      expect(rows[0].createdAtUtc).not.toBe(null);
      expect(rows[0].deleted).toBe(null);
      expect(rows[0].deletedAtUtc).toBe(null);

      expect(hasInvalidCounterData(rows[0])).toBe(false);
    });

    it('selects Id by namespace/name', async () => {
      await insertCounter('namespace1', 'name1');
      await insertCounter('namespace2', 'name2');

      const [rows1] = await selectId('namespace1', 'name1');
      const [rows2] = await selectId('namespace2', 'name2');

      expect(rows1.length).toBe(1);
      expect(rows2.length).toBe(1);

      expect(rows1[0].id).toBe(1);
      expect(rows2[0].id).toBe(2);
    });

    it('deletes a counter', async () => {
      await insertCounter('namespace1', 'name1');

      const [rows1] = await select('namespace1', 'name1');
      expect(rows1[0].deleted).toBe(null);
      expect(rows1[0].deletedAtUtc).toBe(null);

      const [result] = await deleteCounter('namespace1', 'name1');
      expect(result.affectedRows).toBe(1);

      const [rows2] = await select('namespace1', 'name1');
      expect(rows2[0].deleted).toBe(1);
      expect(rows2[0].deletedAtUtc).not.toBe(null);
    });

    it('creates a status summary', async () => {
      await insertCounter('namespace1', 'name1');
      await insertCounter('namespace1', 'name2');
      await insertCounter('namespace2', 'name3');

      const [result] = await deleteCounter('namespace1', 'name2');

      expect(result.affectedRows).toBe(1);

      const [rows1] = await selectStatusSummary(null, null);
      const [rows2] = await selectStatusSummary('namespace1', null);
      const [rows3] = await selectStatusSummary('namespace2', 'name3');

      expect(rows1).toEqual([{active: 2, deleted: 1}]);
      expect(rows2).toEqual([{active: 1, deleted: 1}]);
      expect(rows3).toEqual([{active: 1, deleted: 0}]);
    });

    it('insert and select Counter Hit by namespace/name or Id', async () => {
      const name = 'name1';
      const namespace = 'namespace1';

      await insertCounter(namespace, name);
      await insertCounterHit(1);

      const [rows] = await selectHitCount(namespace, name);
      const [rowsId] = await selectHitCountById(1);

      expect(rows.length).toBe(1);
      expect(rowsId.length).toBe(1);

      expect(rows[0].hits).toBe(1);
      expect(rowsId[0].hits).toBe(1);

      await insertCounterHit(1);
      await insertCounterHit(1);

      const [rowsId2] = await selectHitCountById(1);
      expect(rowsId2[0].hits).toBe(3);
    });

    it('selects active counters data', async () => {
      await insertCounter('namespace1', 'name1');
      await insertCounter('namespace1', 'name2');
      await insertCounter('namespace2', 'name3');

      await insertCounterHit(1);

      await insertCounterHit(2);
      await insertCounterHit(2);

      await insertCounterHit(3);
      await insertCounterHit(3);
      await insertCounterHit(3);

      await deleteCounter('namespace1', 'name2');

      const [rows1] = await selectActiveCounters(null, null);
      const [rows2] = await selectActiveCounters('namespace1', null);
      const [rows3] = await selectActiveCounters('namespace2', 'name3');

      expect(rows1.length).toBe(2);
      expect(rows1).toEqual([
        {
          namespace: 'namespace1',
          name: 'name1',
          createdAtUtc: expect.any(String),
          hits: 1,
          lastHit: expect.any(String),
        },
        {
          namespace: 'namespace2',
          name: 'name3',
          createdAtUtc: expect.any(String),
          hits: 3,
          lastHit: expect.any(String),
        },
      ]);

      expect(rows2.length).toBe(1);
      expect(rows2).toEqual([
        {
          namespace: 'namespace1',
          name: 'name1',
          createdAtUtc: expect.any(String),
          hits: 1,
          lastHit: expect.any(String),
        },
      ]);

      expect(rows3.length).toBe(1);
      expect(rows3).toEqual([
        {
          namespace: 'namespace2',
          name: 'name3',
          createdAtUtc: expect.any(String),
          hits: 3,
          lastHit: expect.any(String),
        },
      ]);
    });
  });
});
