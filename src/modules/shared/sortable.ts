export class Sortable {
  private dragEl: HTMLElement;
  constructor(
    private list: HTMLElement,
    private onUpdate: (dragEl: HTMLElement) => any
  ) {
    this.init();
  }

  init() {
    // Making all siblings movable
    [].slice.call(this.list.children).forEach(function (itemEl: HTMLElement) {
      itemEl.draggable = true;
    });

    // Sorting starts
    this.list.addEventListener('dragstart', (evt) => {
      this.dragEl = evt.target as HTMLElement; // Remembering an element that will be moved

      // Limiting the movement type
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('Text', this.dragEl.textContent);


      // Subscribing to the events at dnd
      this.list.addEventListener('dragover', e => this.onDragOver(e), false);
      this.list.addEventListener('dragend', e => this.onDragEnd(e), false);


      setTimeout(() => {
        // If this action is performed without setTimeout, then
        // the moved object will be of this class.
        this.dragEl.classList.add('sortable__ghost');
      }, 0);
    }, false);

  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    let target = evt.target as HTMLElement;
    if (target && target !== this.dragEl && target.nodeName == 'DIV') {
      // Sorting
      const targetRect = target.getBoundingClientRect();
      const offset = {
        x: evt.pageX - targetRect.left,
        y: evt.pageY - targetRect.top
      };
      const middleY = (targetRect.bottom - targetRect.top) / 2;

      let before = target;
      if (offset.y > middleY) {
        before = target.nextSibling as HTMLElement;
      }
      try {
        this.list.insertBefore(this.dragEl, before);
      } catch (error) { }
    }
  }

  onDragEnd(evt: DragEvent) {
    evt.preventDefault();

    this.dragEl.classList.remove('sortable__ghost');
    this.list.removeEventListener('dragover', e => this.onDragOver(e), false);
    this.list.removeEventListener('dragend', e => this.onDragEnd(e), false);


    // Notification about the end of sorting
    this.onUpdate(this.dragEl);
  }
}
