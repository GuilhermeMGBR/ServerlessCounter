import {
  resolveExecuteSingleHandlerMock,
  resolveQueryHandlerMock,
} from '@shared/MySQL/mysqlHelper.mocks';
import {
  insertCounter,
  insertCounterHit,
  selectActiveCounters,
  selectHitCount,
  selectHitCountById,
  selectId,
  selectStatusSummary,
} from './CounterRepository';

import type {Connection} from 'mysql2/promise';
import type {
  GetExecuteSingleHandlerMockProps,
  GetQueryHandlerMockProps,
} from '@shared/MySQL/mysqlHelper.mocks';
import type {
  ActiveCountersResult,
  HitCountResult,
  SelectIdResult,
  StatusSummaryResult,
} from '@CounterService/CounterRepository/CounterRepository.types';

export const DEFAULT_MOCK_ID = 10;
export const DEFAULT_MOCK_HIT_COUNT = 12345678910;

export const getSelectIdMock =
  (mockProps: GetQueryHandlerMockProps<SelectIdResult>) =>
  async (...params: Parameters<typeof selectId>) =>
    selectId(params[0], params[1], resolveQueryHandlerMock(mockProps));

export const getSelectHitCountMock =
  (mockProps: GetQueryHandlerMockProps<HitCountResult>) =>
  async (...params: Parameters<typeof selectHitCount>) =>
    selectHitCount(params[0], params[1], resolveQueryHandlerMock(mockProps));

export const getSelectHitCountByIdMock =
  (mockProps: GetQueryHandlerMockProps<HitCountResult>) =>
  async (...params: Parameters<typeof selectHitCountById>) =>
    selectHitCountById(params[0], resolveQueryHandlerMock(mockProps));

export const getSelectActiveCountersMock =
  (mockProps: GetQueryHandlerMockProps<ActiveCountersResult>) =>
  async (...params: Parameters<typeof selectActiveCounters>) =>
    selectActiveCounters(
      params[0],
      params[1],
      resolveQueryHandlerMock(mockProps),
    );

export const getSelectStatusSummaryMock =
  (mockProps: GetQueryHandlerMockProps<StatusSummaryResult>) =>
  async (...params: Parameters<typeof selectStatusSummary>) =>
    selectStatusSummary(
      params[0],
      params[1],
      resolveQueryHandlerMock(mockProps),
    );

export const getInsertCounterMock =
  (mockProps: GetExecuteSingleHandlerMockProps) =>
  async (...params: Parameters<typeof insertCounter>) =>
    insertCounter(
      params[0],
      params[1],
      resolveExecuteSingleHandlerMock(mockProps),
    );

export const getInsertCounterHitMock =
  (mockProps: GetExecuteSingleHandlerMockProps) =>
  async (...params: Parameters<typeof insertCounterHit>) =>
    insertCounterHit(params[0], resolveExecuteSingleHandlerMock(mockProps));

export const getCounterRepositoryMock = () => ({
  selectId: jest.fn(),
  selectHitCount: jest.fn(),
  selectHitCountById: jest.fn(),
  insertCounter: jest.fn(),
  insertCounterHit: jest.fn(),
});
