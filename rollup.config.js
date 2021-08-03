import sass from 'rollup-plugin-sass'
import jsx from 'rollup-plugin-jsx'
import pkg from './package.json'

export default {
  input: "src/index.jsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    sass({ insert: true }),
    jsx( {factory: 'React.createElement'} )
  ],
  external: ["react", "react-dom"],
};