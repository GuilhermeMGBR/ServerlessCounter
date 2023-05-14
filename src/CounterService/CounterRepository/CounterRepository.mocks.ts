import {Connection} from 'mysql2/promise';
import {
  getHitCountResult,
  getSelectIdResult,
  HitCountResult,
  SelectIdResult,
} from '@CounterService/CounterRepository/CounterRepository.types';
import {
  getExecuteSingleHandlerMock,
  GetExecuteSingleHandlerMockProps,
  getQueryHandlerMock,
  GetQueryHandlerMockProps,
} from '@shared/MySQL/mysql.mocks';
import {
  insertCounter,
  selectHitCount,
  selectHitCountById,
  selectId,
} from './CounterRepository';

export const DEFAULT_MOCK_ID = 10;
export const DEFAULT_MOCK_HIT_COUNT = 12345678910;

export const getSelectIdMock =
  (mockProps: GetQueryHandlerMockProps<SelectIdResult>): typeof selectId =>
  async (
    namespace: Parameters<typeof selectId>[0],
    name: Parameters<typeof selectId>[1],
    _ignoredQueryHandler: Parameters<typeof selectId>[2],
  ) =>
    selectId(
      namespace,
      name,
      Promise.resolve(
        getQueryHandlerMock<SelectIdResult>(mockProps)({} as Connection),
      ),
    );

export const getSelectHitCountMock =
  (
    mockProps: GetQueryHandlerMockProps<HitCountResult>,
  ): typeof selectHitCount =>
  async (
    namespace: Parameters<typeof selectHitCount>[0],
    name: Parameters<typeof selectHitCount>[1],
    _ignoredQueryHandler: Parameters<typeof selectHitCount>[2],
  ) =>
    selectHitCount(
      namespace,
      name,
      Promise.resolve(
        getQueryHandlerMock<HitCountResult>(mockProps)({} as Connection),
      ),
    );

export const getSelectHitCountByIdMock =
  (
    mockProps: GetQueryHandlerMockProps<HitCountResult>,
  ): typeof selectHitCountById =>
  async (
    id: Parameters<typeof selectHitCountById>[0],
    _ignoredQueryHandler: Parameters<typeof selectHitCountById>[1],
  ) =>
    selectHitCountById(
      id,
      Promise.resolve(
        getQueryHandlerMock<HitCountResult>(mockProps)({} as Connection),
      ),
    );

export const getInsertCounterMock =
  (mockProps: GetExecuteSingleHandlerMockProps): typeof insertCounter =>
  async (
    namespace: Parameters<typeof insertCounter>[0],
    name: Parameters<typeof insertCounter>[1],
    _ignoredQueryHandler: Parameters<typeof insertCounter>[2],
  ) =>
    insertCounter(
      namespace,
      name,
      Promise.resolve(getExecuteSingleHandlerMock(mockProps)({} as Connection)),
    );

export var testSelectIdResult1 = [getSelectIdResult(DEFAULT_MOCK_ID)];
export var testHitCountResult1 = [getHitCountResult(DEFAULT_MOCK_HIT_COUNT)];

export const getCounterRepositoryMock = () => ({
  selectId: jest.fn(),
  selectHitCount: jest.fn(),
  selectHitCountById: jest.fn(),
  insertCounter: jest.fn(),
  insertCounterHit: jest.fn(),
});
