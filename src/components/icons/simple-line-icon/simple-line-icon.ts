
import {Component, ElementRef, Input, OnChanges, Renderer, SimpleChange, SimpleChanges} from '@angular/core';
import {Config, Ion} from 'ionic-angular';

@Component({
  selector: 'simple-line-icon',
  template: ''
})

/**
 * extends ion icon to display simple line icons
 * @class SimpleLineIconComponent
 * @extends Ion
 * @implements OnChanges
 */
export class SimpleLineIconComponent extends Ion implements OnChanges  {
  @Input() public name: string;
  @Input() public size: string;

  @Input('fixed-width')
  set fixedWidth(fixedWidth: string) {
    this.setElementClass('icon-fw', this.isTrueProperty(fixedWidth));
  }

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer, 'icon');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.name) {
      this.unsetPrevAndSetCurrentClass(changes.name);
    }
    if (changes.size) {
      this.unsetPrevAndSetCurrentClass(changes.size);
    }
  }

  public isTrueProperty(val: any): boolean {
    if (typeof val === 'string') {
      val = val.toLowerCase().trim();
      return (val === 'true' || val === 'on' || val === '');
    }
    return !!val;
  }

  public unsetPrevAndSetCurrentClass(change: SimpleChange) {
    this.setElementClass('icon-' + change.previousValue, false);
    this.setElementClass('icon-' + change.currentValue, true);
  }
}
