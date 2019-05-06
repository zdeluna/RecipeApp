const environments = require('./jest-transformer.js');

module.exports = {
    presets: [],
    plugins: [
        [
            'styled-components',
            {ssr: true, displayName: true, preprocess: false},
        ],
        [
            'module-resolver',
            {
                root: ['./'],
            },
        ],
    ],
    env: {
        dev: {
            plugins: [
                ['transform-define', environments],
                ['module-resolver', {root: ['./']}],
                'transform-decorators-legacy',
                'transform-class-properties',
            ],
        },
        build: {
            plugins: [
                ['transform-define', environments],
                ['module-resolver', {root: ['./']}],
                'transform-decorators-legacy',
                'transform-class-properties',
            ],
        },
        production: {
            presets: [
                [
                    'minify', // why add minify here, we run uglify over the whole code bundles
                    {
                        mangle: false,
                        evaluate: false,
                    },
                ],
            ],
            plugins: [
                ['transform-define', environments],
                ['@babel/plugin-proposal-decorators', {legacy: true}],
                ['@babel/plugin-proposal-class-properties', {loose: true}],
                ['module-resolver', {root: ['./']}],
            ],
            comments: false,
            compact: true,
            minified: true,
        },
    },
};
