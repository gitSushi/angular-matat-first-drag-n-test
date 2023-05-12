import { Component, Input } from '@angular/core';

import { Word } from './word';
import { WordService } from './word.service';

/**
 * @title Basic icons
 */
@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css'],
})
export class WordComponent {
  @Input('word') word: Word;

  draggedId: number;

  constructor(private service: WordService) {}

  /**
   * DRAG EVENTS
   */
  handleDrag(event) {}

  handleDragStart(event, word: Word) {
    this.draggedId = word.id;
    this.service.hideDragged(event);
    event.dataTransfer.setData('text', JSON.stringify(word));
  }

  handleDragEnd(event) {
    this.draggedId = null;
    this.service.showDragged(event);
  }

  /**
   * DROP EVENTS
   */
  handleDragEnter(event): void {
    // event.preventDefault()
    if (event.target.id !== `dropzone-after-${this.draggedId}`) {
      this.service.showDropzone(event);
    }
  }

  handleDragLeave(event): void {
    this.service.hideDropzone(event);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event, word: Word) {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData('text'));

    this.service.moveTo(word, data);
    this.service.hideDropzone(event);
  }
}
