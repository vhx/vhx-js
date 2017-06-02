import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import conditional from 'rollup-plugin-conditional';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  entry: './lib/vhx.js',
  format: 'umd',
  dest: './dist/vhx.js',
  moduleName: 'VhxApi',
  sourceMap: true,
  plugins: [
    nodeResolve({
      browser: true,
      jsnext: true
    }),
    commonjs(),
    buble(),
    conditional(isProduction, [
      uglify({
        sourceMap: true
      })
    ])
  ]
};