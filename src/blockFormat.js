export default class BlockFormat {
  constructor (name, options) {
    this.name = name;
    this.options = options;
    this.triggers = options.triggers;
  }

  format (next, options) {
    const trigger = this.options.triggers.find((trigger) => next.startsWith(trigger));
    if(trigger){
      const format = this.options.format(next, options);

      return {
        open: format.open,
        trigger: (this.options.excludeTrigger || options.readonly ? "" : trigger),
        close: format.close,
        advance: trigger.length
      }
    }else{
      return;
    }
  }
}