import { Injectable, Renderer2 } from '@angular/core';
import { Word } from './word';

@Injectable()
export class WordService {
  root: Word = {
    id: 1,
    parendId: -1,
    value: 'Manners people, watch your manners.',
    words: [
      {
        id: 2,
        parendId: 1,
        value: 'The word !',
      },
      {
        id: 3,
        parendId: 1,
        value: 'Nothing to see',
      },
      {
        id: 4,
        parendId: 1,
        value: '... but the moon',
        words: [
          {
            id: 5,
            parendId: 4,
            value: "'m talkin' 'bout the dark side",
            words: [
              {
                id: 6,
                parendId: 5,
                value: 'Roxaaane !',
                words: [
                  {
                    id: 7,
                    parendId: 6,
                    value: '_ shouting in the wind.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  constructor(private renderer: Renderer2) {}

  getWord(): Word {
    return this.root;
  }

  /**
   * Find by id function in the tree data structure.
   * It returns the found node.
   *
   * @param {number} id - An id number just like Word.id.
   * @returns {Word} The found node.
   */
  traverseTree(id: number): Word {
    let searchResult: Word;
    const loop = (w: Word) => {
      if (w.id === id) {
        searchResult = w;
      }
      if ('words' in w) {
        for (let e of w.words) {
          loop(e);
        }
      }
    };
    loop(this.root);
    return searchResult;
  }

  getWordById(id: number, draggedId: number): Word | null {
    const searchResult = this.traverseTree(Number(id));
    if (searchResult.id === draggedId) {
      return null;
    }
    return searchResult;
  }

  getLevel(id: number): number {
    let level = 0;
    const node = this.traverseTree(id);
    let parent = this.traverseTree(node.parendId);
    while (parent) {
      parent = this.traverseTree(parent.parendId);
      level++;
    }
    return level;
  }

  printTree() {
    console.log();
    const loop = (tn: Word) => {
      console.log(`${'  '.repeat(this.getLevel(tn.id))}|-- ${tn.value}`);
      if ('words' in tn) {
        for (let e of tn.words) {
          loop(e);
        }
      }
    };
    if (this.root) {
      loop(this.root);
    }
  }

  /**
   * Moves the dragged item to its dropped location
   * without its children nodes (if any).
   * The children nodes will be reattached to the parent node
   * of the dragged item.
   *
   * @param {Word} referenceWord - The item that will become
   * the previous item of the dragged item at its new location.
   * @param {Word} draggedWord - The dragged item (sadly not
   * of type Word after the dataTransfer).
   */
  moveTo(referenceWord: Word, draggedWord: Word): void {
    console.log('referenceWord', referenceWord);
    console.log('draggedWord', draggedWord);

    /** @type {Word} child node */
    const cn: Word = this.traverseTree(draggedWord.id);
    console.log('cn', cn);

    const currentParentNode = this.traverseTree(cn.parendId);
    console.log('currentParentNode', currentParentNode);

    const newParentNode = this.traverseTree(referenceWord.parendId);
    console.log('newParentNode', newParentNode);
    // err : indexof on undefined
    if (cn) {
      const index = currentParentNode.words.indexOf(cn);

      if (index > -1) {
        currentParentNode.words.splice(index, 1);
        if ('words' in cn) {
          currentParentNode.words.splice(index, 0, ...cn.words);
          delete cn.words;
        }
      }
      cn.parendId = newParentNode.id;
    }
    if (referenceWord) {
      // err : indexof on undefined
      if ('words' in newParentNode) {
        const idx = newParentNode.words.indexOf(referenceWord);
        if (idx > -1) newParentNode.words.splice(idx + 1, 0, cn);
      }
    }
    this.printTree();
  }

  /**
   * On dragenter, adds a class to the targeted element
   * to show the dropzone to the user.
   *
   * @param {DragEvent} event - The drag event giving access to
   * the targeted element.
   */
  showDropzone(event: DragEvent) {
    this.renderer.addClass(event.target, 'valid-dropzone');
  }

  /**
   * On dragleave, removes the class from the targeted element
   * to hide the dropzone from the user.
   *
   * @param {DragEvent} event - The drag event giving access to
   * the targeted element.
   */
  hideDropzone(event: DragEvent) {
    this.renderer.removeClass(event.target, 'valid-dropzone');
  }

  /**
   * On dragstart, adds a class to the targeted element
   * to display it opaque (opacity: 0.3) while the item is being dragged.
   *
   * @param {DragEvent} event - The drag event giving access to
   * the targeted element.
   */
  hideDragged(event: DragEvent) {
    this.renderer.addClass(event.target, 'dragged-item');
  }

  /**
   * On dragend, removes the class from the targeted element
   * to display it dense (opacity: 1).
   *
   * @param {DragEvent} event - The drag event giving access to
   * the targeted element.
   */
  showDragged(event: DragEvent) {
    this.renderer.removeClass(event.target, 'dragged-item');
  }
}
