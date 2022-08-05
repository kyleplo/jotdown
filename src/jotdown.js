import "./jotdown.css";
import { JotDownChangeEvent, JotDownSelectionChangeEvent } from "./events.js"
import { setImmediate } from "./utils.js"

export * from  "./inlineFormats/all.js"
export * from "./blockFormats/all.js"

export class JotDown extends EventTarget {
  constructor (container, options) {
    super();

    this._container = document.createElement("DIV");
    this._container.classList.add("jotdown-container");
    container.append(this._container);

    setImmediate(() => {
      this._container.style.setProperty("--jotdown-text-color", window.getComputedStyle(this._container).color)
    });

    this._options = Object.assign({
      readonly: false,
      mayBecomeWritable: true,
      inlineFormats: [],
      blockFormats: [],
      seekMemory: 1000,
      linkTarget: "_blank"
    }, options || {});

    this._order = [];

    this._preview = document.createElement("DIV");
    this._preview.classList.add("jotdown-paragraph", "jotdown-preview");
    this._container.append(this._preview);

    if(this._options.mayBecomeWritable){
      this._editor = document.createElement("TEXTAREA");
      this._editor.classList.add("jotdown-paragraph", "jotdown-editor");
      this._editor.addEventListener("input", () => {
        this._refresh();
        super.dispatchEvent(new JotDownChangeEvent());
      });
      this._editor.addEventListener("keydown", e => {
        if(e.key === "Enter"){
          this._continueFormat();
        }
      });
      this._container.append(this._editor);

      document.addEventListener("selectionchange", () => {
        if(this._editor.selectionStart !== null && this._editor.selectionEnd !== null){
          super.dispatchEvent(new JotDownSelectionChangeEvent());
        }
      });
    }

    if(this._options.readonly){
      this._editor.setAttribute("readonly", "readonly");
      this._container.classList.add("jotdown-readonly");
    }else{
      this._preview.setAttribute("aria-hidden", "true");
    }
  }

  get readonly () {
    return this._options.readonly;
  }

  set readonly (newValue) {
    if(this._options.mayBecomeWritable){
      this._options.readonly = newValue;
      if(this._options.readonly){
        this._editor.setAttribute("readonly", "readonly");
        this._preview.removeAttribute("aria-hidden");
        this._container.classList.add("jotdown-readonly");
      }else{
        this._editor.removeAttribute("readonly");
        this._preview.setAttribute("aria-hidden", "true");
        this._container.classList.remove("jotdown-readonly");
      }
      this._refresh();
    }
  }

  applyInlineFormat (format) {
    if(!format.bounds || this._editor.selectionStart === null || this._editor.selectionEnd === null){
      return false;
    }

    this._editor.setRangeText(format.bounds[0][0], this._editor.selectionStart, this._editor.selectionStart);
    this._editor.setRangeText(format.bounds[0][1], this._editor.selectionEnd, this._editor.selectionEnd);
    super.dispatchEvent(new JotDownChangeEvent());
    super.dispatchEvent(new JotDownSelectionChangeEvent());

    this._refresh();

    return true;
  }

  removeInlineFormat (format) {
    if(!format.bounds || this._editor.selectionStart === null || this._editor.selectionEnd === null){
      return false;
    }

    var successful = false;

    if(this._editor.selectionStart === this._editor.selectionEnd && this.detectFormat(format)){
      this._editor.setRangeText(format.bounds[0][1], this._editor.selectionStart, this._editor.selectionStart);
      this._editor.setRangeText(format.bounds[0][0], this._editor.selectionEnd, this._editor.selectionEnd);
      successful = true;
    }else{
      format.bounds.forEach(bounds => {
        if(!successful && this._editor.value.slice(this._editor.selectionStart - bounds[0].length, this._editor.selectionStart) === bounds[0] && this._editor.value.slice(this._editor.selectionEnd, this._editor.selectionEnd + bounds[1].length) === bounds[1]){
          this._editor.setRangeText("", this._editor.selectionStart - bounds[0].length, this._editor.selectionStart);
          this._editor.setRangeText("", this._editor.selectionEnd, this._editor.selectionEnd + bounds[1].length);
          successful = true;
        }else if(!successful && this._editor.value.slice(this._editor.selectionStart, this._editor.selectionStart + bounds[0].length) === bounds[0] && this._editor.value.slice(this._editor.selectionEnd - bounds[1], this._editor.selectionEnd) === bounds[1]){
          this._editor.setRangeText("", this._editor.selectionStart, this._editor.selectionStart + bounds[0].length);
          this._editor.setRangeText("", this._editor.selectionEnd - bounds[1].length, this._editor.selectionEnd);
          successful = true;
        }
      });
    }

    if(successful){
      super.dispatchEvent(new JotDownChangeEvent());
      super.dispatchEvent(new JotDownSelectionChangeEvent());
      this._refresh();
    }

    return successful;
  }

  applyBlockFormat (format) {
    if(!format.triggers || this._editor.selectionStart === null || this._editor.selectionEnd === null){
      return false;
    }

    var i = this._editor.selectionStart;
    while(i > -1 && this._editor.value[i] !== "\n" && this._editor.value[i] !== "\r"){
      i--;
    }
    i++;
    this._editor.setRangeText(format.triggers[0], i, i);
    super.dispatchEvent(new JotDownChangeEvent());
    super.dispatchEvent(new JotDownSelectionChangeEvent());
    this._refresh();
    return true;
  }

  removeBlockFormat (format) {
    if(!format.triggers || !this._editor.selectionStart || !this._editor.selectionEnd){
      return false;
    }

    var i = this._editor.selectionStart;
    while(i > -1 && this._editor.value[i] !== "\n" && this._editor.value[i] !== "\r"){
      i--;
    }
    i++;
    if(format.detectTrigger){
      const works = format.detectTrigger(this._editor.value.slice(i, i + this._options.seekMemory));
      if(works){
        this._editor.setRangeText("", i, i + works.length);
        super.dispatchEvent(new JotDownChangeEvent());
        super.dispatchEvent(new JotDownSelectionChangeEvent());
        this._refresh();
      }
      return works;
    }else{
      return !!format.triggers.find(trigger => {
        const works = this._editor.value.slice(i, i + this._options.seekMemory).startsWith(trigger);
        if(works){
          this._editor.setRangeText("", i, i + trigger.length);
          super.dispatchEvent(new JotDownChangeEvent());
          super.dispatchEvent(new JotDownSelectionChangeEvent());
          this._refresh();
        }
        return works;
      });
    }
  }

  detectFormat (format) {
    var i = 0;

    while(this._order[i] && this._order[i].position < this._editor.selectionStart){
      i++;
    }
    i--;

    const startPosition = i;

    while(this._order[i] && this._order[i].position < this._editor.selectionEnd){
      if(this._order[i].name === format.name && this._order[i].type === "end"){
        return false;
      }
      i++;
    }

    i = startPosition;

    while(this._order[i] && this._order[i].name !== format.name){
      i--;
    }

    if(this._order[i] && this._order[i].name === format.name && this._order[i].type === "begin"){
      return true;
    }

    return false;
  }

  _refresh () {
    const input = this._editor.value;

    this._order = [];

    var output = "";
    var i = 0;

    var chain = [];
    var closeLine = null;

    formatLoop:
    while(i < input.length){
      var next = input.slice(i, i + this._options.seekMemory);

      if(next.startsWith("\n") || next.startsWith("\r") || i === 0){
        output += chain.map(t => "</" + t.split(" ")[0] + ">").join("");
        if(closeLine){
          output += closeLine.output;
          this._order.push({
            position: i,
            type: "end",
            name: closeLine.name
          });
          closeLine = null;
        }

        if((next.startsWith("\n") || next.startsWith("\r"))){
          if(i === 0){
            output += "<br>";
          }
          next = next.slice(1);
          i += 1;
        }

        if(next.startsWith("\n") || next.startsWith("\r") || !next[0]){
          output += "<br>";
          continue formatLoop;
        }

        for(var x = 0;x < this._options.blockFormats.length;x++){
          const format = this._options.blockFormats[x];
          const result = format.format(next, this._options);

          if(result){
            output += result.open + result.trigger;
            closeLine = {
              name: format.name,
              output: result.close,
            };
            i += result.advance;
            output += chain.map(t => "<" + t + ">").join("");
            this._order.push({
              position: i,
              type: "begin",
              name: format.name
            });
            continue formatLoop;
          }
        }

        if(!closeLine){
          output += "<p>";
          closeLine = {
            name: "paragraph",
            output: "</p>"
          };
        }
        output += chain.map(t => "<" + t + ">").join("");
      }

      if(i === 0 || input[i - 1] !== "\\"){
        for(var x = 0;x < this._options.inlineFormats.length;x++){
          const format = this._options.inlineFormats[x];
          const result = format.format(next, chain, this._options);

          if(result){
            if(this._order.filter(f => f.name === format.name).length % 2 === 1 && !format.selfClosing){
              this._order.push({
                position: i,
                type: "end",
                name: format.name
              });
            }else{
              this._order.push({
                position: i,
                type: "begin",
                name: format.name
              });
            }

            output += result.output;
            i += result.advance;

            if(format.selfClosing){
              this._order.push({
                position: i,
                type: "end",
                name: format.name
              });
            }

            continue formatLoop;
          }
        }
      }

      if(next[0] === "<"){
        output += "&lt;";
        i += 1;
      }else if(next[0] === ">"){
        output += "&gt;";
        i += 1;
      }else if(next[0] === "\\" && next[1] !== "\\" && this._options.readonly){
        i += 1;
      }else if(next[0] !== "\n" && next[0] !== "\r"){
        output += next[0];
        i += 1;
      }
    }
    
    output += chain.map(t => "</" + t.split(" ")[0] + ">").join("");
    if(closeLine){
      output += closeLine.output;
    }

    this._preview.innerHTML = output;
  }

  _continueFormat () {
    var line = this._editor.value.slice(0, this._editor.selectionEnd);
    line = line.slice(Math.max(line.lastIndexOf("\n") + 1, line.lastIndexOf("\r") + 1, 0));

    this._options.blockFormats.forEach(format => {
      if(format.continue){
        const continuation = format.continue(line);
        if(continuation){
          this._editor.setRangeText(continuation, this._editor.selectionEnd, this._editor.selectionEnd);
          setImmediate(() => {
            this._editor.setRangeText(continuation, this._editor.selectionEnd, this._editor.selectionEnd + continuation.length, "end");
            super.dispatchEvent(new JotDownChangeEvent());
            super.dispatchEvent(new JotDownSelectionChangeEvent());
          });
          return;
        }
      }
    });
  }

  get value () {
    return this._editor.value;
  }

  set value (newValue) {
    this._editor.value = newValue;

    this._refresh();
  }
}