module.exports = function (wallaby) {
  return {
    files: [
      'package.json',
      'tsconfig.json',
      'src/**/*.ts',
    ],

    tests: ['test/**/*.test.ts?(x)'],

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({
        module: 'commonjs',
      }),
    },

    testFramework: 'jest',

    env: {
      type: 'node',
      runner: 'node',
    },

    debug: true,
  }
};