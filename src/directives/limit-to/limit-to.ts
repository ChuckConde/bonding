import { Directive, ElementRef, HostListener, Input} from '@angular/core';

/**
 * the tab input directive is responsible for restricting the input value length and
 * tabing into the next elevment specified.
 * the @Input() limitTo specifies the length of the value to restrict on the input
 * !!this directive requires an input to have a tabIndex property set to work.
 * @example
 * <td *ngFor="let number of [0,1,2,3]; let i = index">
 *   <mat-form-field class="full-width">
 *     <input matInput value="" [tabInput]="1" [tabindex]="i"  required>
 *   </mat-form-field>
 * </td>
 *
 * in the above case, an ngfor directive creates 4 input where the tabindex attribute is set to the index of the element in the for loop.
 * the tabInput directive is also set to 1 so that it limits the user to just on value per input.
 * @author spencer@ionicity.co.uk
 * @class LimitToDirective
 * @version 0.0.1
 */

@Directive({
  selector: '[limitTo]'
})
export class LimitToDirective {

  /**
   * if input has a value, and is clicked, select the value in the input
   * @method _onClick
   * @param e {any}
   * @return {void}
   */
  @HostListener('click', ['$event'])
  private _onClick(e): void {
    if (e.target.value && e.target.value.trim() !== '') {
      e.target.select();
    }
  }

  /**
   * limits the value form the element to whatever limit is set from the limitTo input property
   * looks for the next element with a tabIndex attribut set
   * focus on the next element and clear value if found
   * @method _onKeypress
   * @param e {any}
   * @return {void}
   */
  @HostListener('keyup', ['$event'])
  private _onKeypress(e): void {
    if (Number(e.target.value)) {
      const nextIndex = e.srcElement.tabIndex + 1;
      const nextInput: any = document.querySelector('input[tabIndex="' + nextIndex + '"');
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }
}
