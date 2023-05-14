import {pathsToModuleNameMapper} from 'ts-jest';
import {compilerOptions} from './tsconfig.json';

import type {JestConfigWithTsJest} from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['../dist/jest.setup.js'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  testMatch: ['**/*.spec.ts'],
};

export default jestConfig;
