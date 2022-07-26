import css from "rollup-plugin-css-only"

export default {
  input: "src/jotdown.js",
  output: [
    {
      file: "build/bundle.umd.js",
      format: "umd",
      name: "jotdown"
    },
    {
      file: "build/bundle.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    css({
      output: "bundle.css"
    })
  ]
}