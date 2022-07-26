import BlockFormat from "../../blockFormat.js";
import "./heading.css"

export default new BlockFormat("h6", {
  triggers: ["###### "],
  format: (next, options) => {
    return {
      open: "<h6>",
      close: "</h6>"
    }
  }
});