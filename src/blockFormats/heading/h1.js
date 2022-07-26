import BlockFormat from "../../blockFormat.js";
import "./heading.css"

export default new BlockFormat("h1", {
  triggers: ["# "],
  format: (next, options) => {
    return {
      open: "<h1>",
      close: "</h1>"
    }
  }
});