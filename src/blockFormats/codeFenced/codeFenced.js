import "./codeFenced.css"
import { indexOfWithInfinity, sanitize } from "../../utils.js";

export default {
  name: "codeFenced",
  triggers: ["```"],
  format: (next, options) => {
    if(next.startsWith("```")){
      const languageAndCode = next.slice(3, Math.min(indexOfWithInfinity(next, "\n```"), indexOfWithInfinity(next, "\r```"), next.length));

      var length = 3;

      const language = languageAndCode.slice(0, Math.min(indexOfWithInfinity(languageAndCode, "\n"), indexOfWithInfinity(languageAndCode, "\r"), languageAndCode.length));
      var code = languageAndCode.slice(Math.min(indexOfWithInfinity(languageAndCode, "\n"), indexOfWithInfinity(languageAndCode, "\r"), languageAndCode.length) + 1);

      length += code.length + language.length + 1;

      if(language && options.highlight){
        code = options.highlight(code, language);
      }else{
        code = sanitize(code);
      }

      code = code.replaceAll("\n", "<br>").replaceAll("\r", "<br>");

      if(code.endsWith("<br>")){
        code += "&zwj;";
      }

      if(next[length] === "\n" || next[length] === "\r"){
        length++;
        if(!options.readonly){
          code += "<br>";
        }
      }

      while(next[length] && next[length] === "`"){
        length++;
        if(!options.readonly){
          code += "`";
        }
      }

      return {
        open: "<code class='jotdown-block-code-fenced'>" + (options.readonly ? "" : "```" + sanitize(language) + "<br>") + code,
        trigger: "",
        close: "</code>",
        advance: length
      }
    }else{
      return;
    }
  }
}