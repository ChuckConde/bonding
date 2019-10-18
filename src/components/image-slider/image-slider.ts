import { Component, Input } from '@angular/core';

@Component({
  selector: 'image-slider',
  templateUrl: 'image-slider.html'
})

/**
 * custom image slider
 * @class ImageSliderComponent
 */
export class ImageSliderComponent {

  /**
   * stores images
   * @property images
   * @public
   * @default any[]
   */
  @Input() public images: any[];

  /**
   * stores index of current image displayed
   * @property index
   * @public
   * @default 0
   */
  public index = 0;

  /**
   * scroll to previous image
   * @method scrollLeft
   * @public
   * @return void
   */
  public scrollLeft(): void {
    if ((this.images.length - 1) >= this.index) {
      this.index = this.images.length - 1;
    } else {
      this.index -= 1;
    }
  }

  /**
   * scroll to next image
   * @method scrollRight
   * @public
   * @return void
   */
  public scrollRight(): void {
    if ((this.images.length - 1) <= this.index) {
      this.index = 0;
    } else {
      this.index += 1;
    }
  }

}
