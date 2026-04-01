import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.spec.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 50,
    },
  },
};

export default config;
