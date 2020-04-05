module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  setupFiles: ['react-app-polyfill/jsdom'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx}', '<rootDir>/src/**/?(*.)(spec|test).{js,jsx}'],
  setupFilesAfterEnv: ['./setupTests.js'],
  testURL: 'http://localhost',
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^(?!.*\\.(css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
};
