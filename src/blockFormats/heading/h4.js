import BlockFormat from "../../blockFormat.js";
import "./heading.css"

export default new BlockFormat("h4", {
  triggers: ["#### "],
  format: (next, options) => {
    return {
      open: "<h4>",
      close: "</h4>"
    }
  }
});