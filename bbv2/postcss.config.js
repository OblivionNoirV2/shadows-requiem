/** @type {import('webpack').Configuration} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  module: {
    rules: [

    ],
    noParse: [require.resolve('typescript/lib/typescript.js')],
  }
}
