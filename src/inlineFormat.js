export default class InlineFormat {
  constructor (name, options) {
    this.name = name;
    this.options = options;
    this.bounds = options.bounds.map(bound => [bound, bound]);
    this.selfClosing = false;
  }

  format (next, chain, options) {
    const bound = this.options.bounds.find(bound => next.startsWith(bound));
    if(bound){
      var output = "";

      if(chain.includes(this.options.tag)){
        if(!options.readonly){
          output += next.slice(0, bound.length);
        }
        var x = chain.indexOf(this.options.tag);
        output += chain.slice(0, x).map(t => "</" + t.split(" ")[0] + ">").join("") + "</" + this.options.tag + ">" + chain.slice(0, x).map(t => "<" + t + ">").join("");
        chain.splice(x, 1);
      }else{
        chain.unshift(this.options.tag);
        output += "<" + this.options.tag + ">";
        if(!options.readonly){
          output += next.slice(0, bound.length);
        }
      }

      return {
        output: output,
        advance: bound.length
      }
    }else{
      return;
    }
  }
}