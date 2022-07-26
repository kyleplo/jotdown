import BlockFormat from "../../blockFormat.js";
import "./heading.css"

export default new BlockFormat("h3", {
  triggers: ["### "],
  format: (next, options) => {
    return {
      open: "<h3>",
      close: "</h3>"
    }
  }
});