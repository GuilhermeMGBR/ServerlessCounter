import {IServiceBehavior} from './BaseServiceBehavior.types';

interface CreateServiceBehaviorMockProps<TParams> {
  mockValidateParams: IServiceBehavior<TParams>['validateParams'];
  mockRun: IServiceBehavior<TParams>['run'];
}

export const createServiceBehaviorMock = <TParams>({
  mockValidateParams,
  mockRun,
}: CreateServiceBehaviorMockProps<TParams>): IServiceBehavior<TParams> => ({
  validateParams: mockValidateParams,
  run: mockRun,
});
