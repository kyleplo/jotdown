import InlineFormat from "../../inlineFormat.js"
import "./highlight.css"

export default new InlineFormat("highlight", {
  bounds: ["=="],
  tag: "span class='jotdown-highlight'"
});