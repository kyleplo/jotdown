import "./orderedList.css"
import { indexOfWithInfinity } from "../../utils.js";

var orderedListActive = false;

function getTrigger(next){
  return (next[0] && !isNaN(parseFloat(next))) ? (next[parseFloat(next).toString().length] === "." || next[parseFloat(next).toString().length] === ")" ? (next[parseFloat(next).toString().length + 1] === " " ? next.slice(0, parseFloat(next).toString().length + 2) : next.slice(0, parseFloat(next).toString().length + 1)) : false) : false;
}

export default {
  name: "orderedList",
  triggers: ["1. "],
  detectTrigger: getTrigger,
  format: (next, options) => {
    const trigger = getTrigger(next);

    if(trigger){
      const listIsNew = !orderedListActive;
      const listContinues = getTrigger(next.slice(Math.min(indexOfWithInfinity(next, "\n") + 1, indexOfWithInfinity(next, "\r") + 1, next.length)))
      orderedListActive = (listIsNew || orderedListActive) && listContinues;

      return {
        open: (listIsNew ? "<ol>" : "") + "<li>",
        trigger: (options.readonly ? "" : trigger),
        close: "</li>" + (listContinues ? "" : "</ol>"),
        advance: trigger.length
      }
    }else{
      return;
    }
  },
  continue: line => {
    const trigger = getTrigger(line);
    if(trigger){
      return (parseFloat(trigger) + 1) + (parseFloat(trigger).toString().length + 1 === trigger.length ? trigger.slice(trigger.length - 1) : trigger.slice(trigger.length - 2));
    }else{
      return false;
    }
  }
}