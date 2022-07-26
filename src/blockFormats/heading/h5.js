import BlockFormat from "../../blockFormat.js";
import "./heading.css"

export default new BlockFormat("h5", {
  triggers: ["##### "],
  format: (next, options) => {
    return {
      open: "<h5>",
      close: "</h5>"
    }
  }
});