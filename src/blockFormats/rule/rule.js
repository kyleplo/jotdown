import BlockFormat from "../../blockFormat.js";
import "./rule.css"

export default new BlockFormat("rule", {
  triggers: ["---", "***", "___", "- - -", "* * *", "_ _ _"],
  format: (next, options) => {
    if(options.readonly){
      return {
        open: "<hr>",
        close: ""
      }
    }else{
      return {
        open: "<p class='jotdown-hr'>",
        close: "</p>"
      };
    }
  }
});