module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!**/node_modules/**', '!**/tests/**'],
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.[jt]s'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
}
