import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import conditional from 'rollup-plugin-conditional';

const isProduction = process.env.NODE_ENV === 'production';
const nodeBuild = process.env.NODE_BUILD;

export default {
  entry: './lib/vhx.js',
  format: 'umd',
  dest: nodeBuild ? './dist/index.js' : './dist/client.js',
  moduleName: 'VhxApi',
  sourceMap: true,
  plugins: [
    conditional(!nodeBuild, [
      nodeResolve({
        browser: true,
        jsnext: true
      }),
    ]),
    commonjs(),
    buble(),
    conditional(isProduction, [
      uglify({
        sourceMap: true
      })
    ])
  ]
};