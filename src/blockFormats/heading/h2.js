import BlockFormat from "../../blockFormat.js";
import "./heading.css"

export default new BlockFormat("h2", {
  triggers: ["## "],
  format: (next, options) => {
    return {
      open: "<h2>",
      close: "</h2>"
    }
  }
});