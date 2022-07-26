import InlineFormat from "../../inlineFormat.js"
import "./bold.css"

export default new InlineFormat("bold", {
  bounds: ["**", "__"],
  tag: "strong"
});