export default {
  name: "link",
  selfClosing: true,
  bounds: [["[", "]()", ")"]],
  format: (next, chain, options) => {
    if(next.startsWith("[") && !chain.find(t => t.startsWith("a href="))){
      var i = 1;
      if(!next.startsWith("[")){
        return;
      }

      while(next[i] && (next[i] !== "]" || (next[i - 1] && next[i - 1] === "\\"))){
        i++;
      }

      if(!next[i] || !next[i + 1] || next[i + 1] !== "("){
        return;
      }
      i += 2;

      var url = "";
      while(next[i] && (next[i] !== ")" || (next[i - 1] && next[i - 1] === "\\"))){
        url += next[i];
        i++;
      }

      if(!next[i]){
        return;
      }

      const link = "a href=\"" + url + "\" target=\"" + options.linkTarget + "\"";
      chain.unshift(link);
      return {
        output: "<" + link + ">" + (options.readonly ? "" : "["),
        advance: 1
      }
    }else if(next.startsWith("](") && chain.find(t => t.startsWith("a href="))){
      return {
        output: (options.readonly ? "" : "]("),
        advance: 2 + (options.readonly ? (next.includes(")") ? next.indexOf(")") - 2 : next.length) : 0)
      }
    }else if(next.startsWith(")") && chain.find(t => t.startsWith("a href="))){
      chain.splice(chain.findIndex(t => t.startsWith("a href=")), 1);

      return {
        output: (options.readonly ? "" : ")") + "</a>",
        advance: 1
      }
    }else{
      return;
    }
  }
}