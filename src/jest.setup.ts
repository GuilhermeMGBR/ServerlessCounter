import {getMySqlMock} from '@shared/MySQL/mysql.mocks';
import {getCounterRepositoryMock} from './CounterService/CounterRepository/CounterRepository.mocks';

// Repositories
jest.mock('@CounterService/CounterRepository', getCounterRepositoryMock);
jest.mock('@shared/MySQL', getMySqlMock);
