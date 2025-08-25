module.exports = {
  displayName: 'WhatsApp & Orders System Tests',
  
  // Test dosyalarını bul
  testMatch: [
    '<rootDir>/test/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts'
  ],
  
  // TypeScript desteği
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Coverage ayarları
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.interface.ts',
    '!src/main.ts'
  ],
  
  // Test setup
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Test environment variables
  setupFiles: ['<rootDir>/test/env.setup.ts'],
  
  // Coverage thresholds - temporarily disabled for development
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80
  //   }
  // }
};
