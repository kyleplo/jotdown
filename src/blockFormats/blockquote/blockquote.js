import BlockFormat from "../../blockFormat.js";
import "./blockquote.css"

export default new BlockFormat("blockquote", {
  triggers: ["> "],
  excludeTrigger: true,
  format: (next, options) => {
    if(options.readonly){
      return {
        open: "<blockquote>",
        close: "</blockquote>"
      }
    }else{
      return {
        open: "<blockquote><strong>&gt;</strong> ",
        close: "</blockquote>"
      };
    }
  }
});