import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: './lib/vhx.js',
  format: 'umd',
  dest: './dist/bundle.js',
  moduleName: 'VhxApi',
  external: ['superagent'],
  plugins: [
		nodeResolve({
      browser: true,
      jsnext: true
    }),
		commonjs(),
		buble()
	]
};