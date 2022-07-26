export default {
  name: "image",
  selfClosing: true,
  bounds: [["![", "]()", ")"]],
  format: (next, chain, options) => {
    var i = 2;
    if(!next.startsWith("![")){
      return;
    }

    var alt = "";
    while(next[i] && (next[i] !== "]" || (next[i - 1] && next[i - 1] === "\\"))){
      alt += next[i];
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
    i += 1;

    if(options.readonly){
      return {
        output: "<img src='" + encodeURI(url) + "' alt='" + alt.replaceAll("'", "\\'") + "'>",
        advance: i
      }
    }else{
      return {
        output: "<a class='jotdown-image-link' href=\"" + encodeURI(url) + "\" target=" + options.linkTarget + ">" + next.slice(0, i) + "</a>",
        advance: i
      }
    }
  }
}