import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'image-grid',
  templateUrl: 'image-grid.html'
})

/**
 * configurable grid displaying images by column in rows
 * numberPerRow input is specified to chnage number of columns
 * @class ImageGridComponent
 */
export class ImageGridComponent {

  /**
   * stores number of row
   * @property rows
   * @type number[]
   */
  public rows: number[];

  /**
   * stores data for images
   * @property data
   * @type any[]
   * @default []
   */
  @Input() public data: any[] = [];

  /**
   * stores number of items per row
   * @property numberPerRow
   * @type number
   * @default 2
   */
  @Input() public numberPerRow = 2;

/**
 * on init, get rows based on number of items and number of items per row specified
 * @method ngOnInit
 * @return {void}
 */
  public ngOnInit(): void {
    this.rows = Array.from(Array(Math.ceil(this.data.length / this.numberPerRow)).keys());
  }
}
