export class JotDownChangeEvent extends Event {
  constructor() {
    super("change");
  }
}

export class JotDownSelectionChangeEvent extends Event {
  constructor() {
    super("selectionchange");
  }
}