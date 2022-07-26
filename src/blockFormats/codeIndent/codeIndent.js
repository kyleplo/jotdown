import BlockFormat from "../../blockFormat.js";
import "./codeIndent.css"

export default new BlockFormat("codeIndent", {
  triggers: ["    ", "\t"],
  format: (next, options) => {
    return {
      open: "<code class='jotdown-block-code'>",
      close: "</code>"
    }
  }
});