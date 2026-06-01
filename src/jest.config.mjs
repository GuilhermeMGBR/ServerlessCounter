import {pathsToModuleNameMapper} from 'ts-jest';
import {readFileSync} from 'node:fs';

const {compilerOptions} = JSON.parse(
  readFileSync(new URL('./tsconfig.json', import.meta.url), 'utf8'),
);

const jestConfig = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>'],
  coverageDirectory: '<rootDir>/../test-reports/coverage',
  modulePaths: [compilerOptions.rootDir],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/*.spec.ts'],
  testResultsProcessor: 'jest-sonar-reporter',
};

export default jestConfig;
