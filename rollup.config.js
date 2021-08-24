// rollup.config.js
const rollupTypescript2 = require('rollup-plugin-typescript2');
const htmlBundle = require('rollup-plugin-html-bundle');
const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const builtins = require('rollup-plugin-node-builtins');

// import builtins from 'rollup-plugin-node-builtins';
import postcss from 'rollup-plugin-postcss';

const fs = require('fs');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const cssInjectPlugin = function (options) {
    return {
        writeBundle() {
            const preTransformationTarget = fs.readFileSync(path.resolve(options.target), 'utf8');
            const source = fs.readFileSync(path.resolve(options.source), 'utf8');
            const replacementString = options.replacementString;

            const transformedTarget = preTransformationTarget.replace(replacementString, source);

            fs.writeFileSync(options.target, transformedTarget);
        },
    };
};

export default [
    {
        input: 'src/main/main.ts',
        output: {
            file: 'dist/main.js',
            format: 'cjs',
        },
        plugins: [commonjs(), nodeResolve(), rollupTypescript2(), builtins()],
    },
    {
        input: 'src/ui/ui.tsx',
        output: {
            file: 'dist/ui.js',
            format: 'iife',
            name: 'ui',
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
                'process.env.REACT_FIGMA_EXPERIMENTAL': true,
            }),
            builtins(),
            commonjs(),
            nodeResolve(),
            rollupTypescript2(),
            postcss({
                extract: 'ui.css',
                modules: false,
                use: ['sass'],
                plugins: [require('postcss-import')],
            }),
            htmlBundle({
                template: 'src/ui/ui-template.html',
                target: 'dist/ui.html',
                inline: true,
            }),

            cssInjectPlugin({
                source: './dist/ui.css',
                target: './dist/ui.html',
                replacementString: '/* DO NOT EDIT - custom css style will be injected here */',
            }),
        ],
    },
];
