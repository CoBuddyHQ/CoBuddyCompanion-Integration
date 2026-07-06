module.exports = {
  preset: '@react-native/jest-preset',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/theme(.*)$':      '<rootDir>/src/theme/index$1',
    '^@/components(.*)$': '<rootDir>/src/components$1',
    '^@/navigation(.*)$': '<rootDir>/src/navigation$1',
    '^@/screens(.*)$':    '<rootDir>/src/screens$1',
    '^@/store(.*)$':      '<rootDir>/src/store/index$1',
    '^@/utils(.*)$':      '<rootDir>/src/utils$1',
    '^@/types(.*)$':      '<rootDir>/src/types$1',
    '^@/services(.*)$':   '<rootDir>/src/services$1',
    '^@/hooks(.*)$':      '<rootDir>/src/hooks$1',
    '^@/assets(.*)$':     '<rootDir>/src/assets$1',
  },
  setupFiles: [],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|react-native-vector-icons)/)',
  ],
};
