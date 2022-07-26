import "./unorderedList.css"

const triggers = ["- ", "+ ", "* ", "-", "+", "*"];

var unorderedListActive = false;

export default {
  name: "unorderedList",
  triggers: triggers,
  format: (next, options) => {
    const trigger = triggers.find((trigger) => next.startsWith(trigger));

    if(trigger){
      const listIsNew = !unorderedListActive;
      const listContinues = !!triggers.find((trigger) => (next.includes("\n" + trigger) && next.indexOf("\n" + trigger) === next.indexOf("\n")) || (next.includes("\r" + trigger) && next.indexOf("\r" + trigger) === next.indexOf("\r")));
      unorderedListActive = (listIsNew || unorderedListActive) && listContinues;

      return {
        open: (listIsNew ? "<ul>" : "") + "<li>",
        trigger: (options.readonly ? "" : trigger),
        close: "</li>" + (listContinues ? "" : "</ul>"),
        advance: trigger.length
      }
    }else{
      return;
    }
  },
  continue: line => {
    const trigger = triggers.find(trigger => line.startsWith(trigger));
    if(trigger && (!line[2] || !triggers.includes(line[2]))){
      return trigger;
    }else{
      return false;
    }
  }
}