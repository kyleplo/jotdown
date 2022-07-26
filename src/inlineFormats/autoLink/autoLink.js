import { indexOfWithInfinity } from "../../utils.js";

export default {
  name: "autoLink",
  selfClosing: true,
  format: (next, chain, options) => {
    if((next.startsWith("https://") || next.startsWith("http://") || next.startsWith("mailto:")) && !chain.find(t => t.startsWith("a href="))){
      var url = next.slice(0, Math.min(indexOfWithInfinity(next, " "), indexOfWithInfinity(next, "\n"), indexOfWithInfinity(next, "\r"), next.length));

      return {
        output: "<a href=\"" + encodeURI(url) + "\" target='" + options.linkTarget + "'>" + (url.startsWith("mailto:") && options.readonly ? url.slice(7) : url) + "</a>",
        advance: url.length
      }
    }else{
      return;
    }
  }
}