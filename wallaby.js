module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.ts'
        ],

        tests: ['test/**/*test.ts?(x)'],

        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
                module: 'commonjs',// jscs:ignore
            })
        },

        testFramework: 'mocha',

        env: {
            type: 'node'
        },

        // workers: {
        //     initial: 0,
        //     regular: 1
        // },

        debug: true,

        setup: function () {
            var jsdom = require('jsdom');
            global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
            global.window = document.defaultView;
            global.navigator = global.window.navigator;
        }
    };
};