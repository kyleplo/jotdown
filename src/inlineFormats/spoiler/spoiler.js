import InlineFormat from "../../inlineFormat.js"
import "./spoiler.css"

export default new InlineFormat("spoiler", {
  bounds: ["||"],
  tag: "span class='jotdown-spoiler'"
});