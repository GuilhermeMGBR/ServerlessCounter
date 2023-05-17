import {IServiceBehavior} from './BaseServiceBehavior.types';

interface CreateServiceBehaviorMockProps<TValidParams, TInvalidParams> {
  mockValidateParams: IServiceBehavior<
    TValidParams,
    TInvalidParams
  >['validateParams'];
  mockRun: IServiceBehavior<TValidParams, TInvalidParams>['run'];
}

export const createServiceBehaviorMock = <TValidParams, TInvalidParams>({
  mockValidateParams,
  mockRun,
}: CreateServiceBehaviorMockProps<
  TValidParams,
  TInvalidParams
>): IServiceBehavior<TValidParams, TInvalidParams> => ({
  validateParams: mockValidateParams,
  run: mockRun,
});
